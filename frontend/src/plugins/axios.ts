import axios from 'axios';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth';
import router from '../router';
import { useToast } from '../composables/useToast';

// Tentukan BASE URL berdasarkan environment
const API_URL = window.location.origin.includes('localhost:5174') ? 
  'http://localhost:5000/api' : 
  `${window.location.origin}/api`;

// Konfigurasi rate limiting
const RATE_LIMIT = {
  maxRequestsPerSecond: 5,
  requestQueue: [] as (() => void)[],
  processingQueue: false,
  lastRequestTime: 0,
  backoffTime: 1000, // waktu awal backoff (1 detik)
  maxBackoffTime: 30000, // maksimum backoff (30 detik)
  currentBackoff: 1000, // backoff saat ini
};

// Buat instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Timeout setelah 30 detik
  timeout: 30000
});

// Helper untuk validasi token
const isValidJWT = (token: string): boolean => {
  // Token JWT harus terdiri dari 3 bagian yang dipisahkan oleh '.'
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Setiap bagian harus berupa Base64URL valid (tanpa padding '=')
  try {
    parts.forEach(part => {
      // Periksa apakah string kosong
      if (!part) return false;
      
      // Periksa apakah karakter valid untuk Base64URL
      if (!/^[A-Za-z0-9_-]+$/.test(part)) return false;
    });
    return true;
  } catch (_) {
    return false;
  }
};

// Fungsi untuk memproses antrean permintaan
const processQueue = async () => {
  if (RATE_LIMIT.processingQueue || RATE_LIMIT.requestQueue.length === 0) {
    return;
  }

  RATE_LIMIT.processingQueue = true;

  while (RATE_LIMIT.requestQueue.length > 0) {
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - RATE_LIMIT.lastRequestTime;
    const minDelay = 1000 / RATE_LIMIT.maxRequestsPerSecond;

    // Pastikan ada jeda waktu yang cukup antara permintaan
    if (timeSinceLastRequest < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
    }

    const request = RATE_LIMIT.requestQueue.shift();
    if (request) {
      RATE_LIMIT.lastRequestTime = Date.now();
      request();
    }

    // Tambahkan jeda kecil antara permintaan
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  RATE_LIMIT.processingQueue = false;
};

// Interceptor untuk request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user-token');
    console.log('Axios - Token tersedia:', !!token);
    
    if (token) {
      // Validasi token sebelum dikirim
      if (isValidJWT(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Token Authorization ditambahkan ke request:', config.url);
      } else {
        console.warn('Token tidak valid - mencoba refresh token');
        // Hapus token yang tidak valid
        localStorage.removeItem('user-token');
      }
    } else {
      console.warn('No token provided for request:', config.url);
    }
    
    // Log request untuk debugging di development
    if (import.meta.env.MODE === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk response
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response di development mode
    if (import.meta.env.MODE === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    
    // Reset backoff time jika request berhasil
    RATE_LIMIT.currentBackoff = RATE_LIMIT.backoffTime;
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const toast = useToast();
    
    // Handle koneksi error (server tidak tersedia)
    if (!error.response) {
      if (!originalRequest?._retryNetworkError) {
        originalRequest._retryNetworkError = true;
        
        // Tunggu 2 detik dan coba lagi
        await new Promise(resolve => setTimeout(resolve, 2000));
        return axiosInstance(originalRequest);
      }
      
      toast.error('Gagal terhubung ke server. Periksa koneksi internet Anda.', {
        timeout: 5000
      });
      return Promise.reject(error);
    }
    
    // Handle JWT format error atau expired token
    if (error.response?.status === 401 && error.response?.data?.error?.message?.includes('jwt')) {
      // Token bermasalah, coba gunakan refresh token
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const authStore = useAuthStore();
          const refreshed = await authStore.refreshUserToken();
          
          if (refreshed) {
            // Jika refresh token berhasil, coba request lagi
            const newToken = localStorage.getItem('user-token');
            if (newToken) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            }
            return axiosInstance(originalRequest);
          } else {
            // Jika refresh token gagal, redirect ke login
            await authStore.logout();
            router.push('/login?redirect=' + router.currentRoute.value.path);
            return Promise.reject(error);
          }
        } catch (_) {
          // Jika refresh token gagal, logout dan redirect
          const authStore = useAuthStore();
          await authStore.logout();
          router.push('/login');
          return Promise.reject(error);
        }
      }
    }
    
    // Handle error umum dengan pesan yang informatif
    const errorMessage = getErrorMessage(error);
    
    // Jangan tampilkan toast untuk error 401 (unauthorize) karena akan di-handle oleh auth flow
    if (error.response.status !== 401) {
      toast.error(errorMessage, { timeout: 5000 });
    }
    
    // Handle error rate limiting dengan exponential backoff
    if (error.response?.status === 429) {
      // Kurangi rate limit untuk mengurangi tekanan pada server
      RATE_LIMIT.maxRequestsPerSecond = Math.max(1, RATE_LIMIT.maxRequestsPerSecond / 2);
      
      // Tingkatkan waktu backoff secara eksponensial
      RATE_LIMIT.currentBackoff = Math.min(
        RATE_LIMIT.maxBackoffTime,
        RATE_LIMIT.currentBackoff * 2
      );
      
      console.log(`Rate limit error detected. Backing off for ${RATE_LIMIT.currentBackoff}ms`);
      
      // Tunggu sesuai waktu backoff dan coba lagi
      if (!originalRequest._retryRateLimit) {
        originalRequest._retryRateLimit = true;
        
        // Tambahkan ke antrean dengan delay
        return new Promise(resolve => {
          setTimeout(() => {
            console.log(`Retrying request after backoff: ${originalRequest.url}`);
            resolve(axiosInstance(originalRequest));
          }, RATE_LIMIT.currentBackoff);
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Buat wrapper untuk menerapkan rate limiting pada semua request
const rateLimit = <T>(fn: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    const executeRequest = () => {
      fn().then(resolve).catch(reject);
    };
    
    RATE_LIMIT.requestQueue.push(executeRequest);
    processQueue();
  });
};

// Override metode axios untuk menerapkan rate limiting
const originalGet = axiosInstance.get;
axiosInstance.get = function<T = any, R = AxiosResponse<T>, D = any>(
  url: string, 
  config?: AxiosRequestConfig<D>
): Promise<R> {
  return rateLimit(() => originalGet.apply(this, [url, config])) as Promise<R>;
};

const originalPost = axiosInstance.post;
axiosInstance.post = function<T = any, R = AxiosResponse<T>, D = any>(
  url: string, 
  data?: D, 
  config?: AxiosRequestConfig<D>
): Promise<R> {
  return rateLimit(() => originalPost.apply(this, [url, data, config])) as Promise<R>;
};

const originalPut = axiosInstance.put;
axiosInstance.put = function<T = any, R = AxiosResponse<T>, D = any>(
  url: string, 
  data?: D, 
  config?: AxiosRequestConfig<D>
): Promise<R> {
  return rateLimit(() => originalPut.apply(this, [url, data, config])) as Promise<R>;
};

const originalDelete = axiosInstance.delete;
axiosInstance.delete = function<T = any, R = AxiosResponse<T>, D = any>(
  url: string, 
  config?: AxiosRequestConfig<D>
): Promise<R> {
  return rateLimit(() => originalDelete.apply(this, [url, config])) as Promise<R>;
};

const originalPatch = axiosInstance.patch;
axiosInstance.patch = function<T = any, R = AxiosResponse<T>, D = any>(
  url: string, 
  data?: D, 
  config?: AxiosRequestConfig<D>
): Promise<R> {
  return rateLimit(() => originalPatch.apply(this, [url, data, config])) as Promise<R>;
};

// Helper function untuk mendapatkan pesan error yang user-friendly
const getErrorMessage = (error: unknown): string => {
  if (!(error as { response?: unknown }).response) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
  }
  
  const status = (error as { response: { status: number } }).response.status;
  const errorData = (error as { response: { data: { error?: { message?: string } } } }).response.data;
  
  switch(status) {
    case 400:
      return errorData.error?.message || 'Data yang dikirim tidak valid.';
    case 401:
      return 'Sesi telah berakhir. Silakan login kembali.';
    case 403:
      return 'Anda tidak memiliki izin untuk melakukan tindakan ini.';
    case 404:
      return errorData.error?.message || 'Data tidak ditemukan.';
    case 409:
      return errorData.error?.message || 'Terjadi konflik data. Data mungkin sudah ada.';
    case 422:
      return errorData.error?.message || 'Format data tidak valid.';
    case 429:
      return 'Terlalu banyak permintaan. Sistem sedang membatasi permintaan, harap tunggu...';
    case 500:
    case 501:
    case 502:
    case 503:
      return 'Terjadi kesalahan pada server. Tim kami sedang memperbaikinya.';
    default:
      return errorData.error?.message || 'Terjadi kesalahan. Silakan coba lagi.';
  }
};

export default axiosInstance;
