import axios from '../plugins/axios';
import { useToast } from '../composables/useToast';

// Buat instance API
const api = {
  // Wrapper untuk GET request
  async get(url: string, config = {}) {
    return await axios.get(url, config);
  },

  // Wrapper untuk POST request
  async post(url: string, data: Record<string, unknown> = {}, config = {}) {
    return await axios.post(url, data, config);
  },

  // Wrapper untuk PUT request
  async put(url: string, data: Record<string, unknown> = {}, config = {}) {
    return await axios.put(url, data, config);
  },

  // Wrapper untuk DELETE request
  async delete(url: string, config = {}) {
    return await axios.delete(url, config);
  },

  // Wrapper untuk PATCH request
  async patch(url: string, data: Record<string, unknown> = {}, config = {}) {
    return await axios.patch(url, data, config);
  },

  // Helper untuk upload file
  async uploadFile(url: string, file: File, additionalData: Record<string, unknown> = {}, onProgress?: (percentage: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    // Tambahkan data tambahan ke formData
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    return await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      }
    });
  },

  /**
   * Helper untuk retry operasi API
   * @param operation - Fungsi yang mengembalikan Promise untuk dijalankan
   * @param retryOptions - Opsi untuk retry
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    {
      retries = 3,
      delay = 1000,
      backoffFactor = 2,
      maxDelay = 10000
    } = {}
  ): Promise<T> {
    let currentRetry = 0;
    let currentDelay = delay;

    const execute = async (): Promise<T> => {
      try {
        return await operation();
      } catch (error: unknown) {
        // Tidak retry untuk error yang bukan jaringan atau server error
        const statusCode = (error as { response?: { status: number } }).response?.status;
        const isNetworkError = !(error as { response?: unknown }).response;
        const isServerError = statusCode && statusCode >= 500;
        
        if (!isNetworkError && !isServerError) {
          throw error;
        }

        if (currentRetry >= retries) {
          throw error;
        }

        // Tunggu dengan backoff eksponensial
        console.log(`Retry attempt ${currentRetry + 1} for API operation after ${currentDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));

        // Tambah retry counter dan update delay
        currentRetry += 1;
        currentDelay = Math.min(currentDelay * backoffFactor, maxDelay);

        // Retry
        return execute();
      }
    };

    return execute();
  },

  /**
   * Helper untuk melakukan beberapa request secara parallel dan menangani errors
   * @param requests - Array dari fungsi yang mengembalikan Promise
   */
  async parallel<T>(requests: Array<() => Promise<T>>): Promise<Array<T | null>> {
    const toast = useToast();
    
    return await Promise.all(
      requests.map(request => 
        request().catch(error => {
          console.error('Error in parallel request:', error);
          toast.error('Gagal memuat sebagian data. Silakan refresh halaman.');
          return null;
        })
      )
    );
  }
};

export default api; 