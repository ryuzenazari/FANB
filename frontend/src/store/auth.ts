import { defineStore } from 'pinia';
import axios from '../plugins/axios';
import router from '../router';

interface User {
  _id: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface GoogleLoginResult {
  token: string;
  refreshToken: string;
  user: any;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    let user = null;
    try {
      const userString = localStorage.getItem('user');
      if (userString && userString !== 'undefined' && userString !== 'null') {
        user = JSON.parse(userString);
      }
    } catch (e) {
      console.error('Error parsing user data from localStorage:', e);
      // Hapus item yang menyebabkan error
      localStorage.removeItem('user');
    }
    
    return {
      user,
      token: localStorage.getItem('user-token') || null,
      refreshToken: localStorage.getItem('refresh-token') || null,
      isAuthenticated: localStorage.getItem('user-token') !== null,
      loading: false,
      error: null
    };
  },
  
  getters: {
    getUser: (state: AuthState) => state.user,
    isLoggedIn: (state: AuthState) => state.isAuthenticated,
  },
  
  actions: {
    initAuth() {
      // Inisialisasi autentikasi ketika aplikasi dimuat
      const token = localStorage.getItem('user-token');
      if (token) {
        console.log('Token ditemukan, mengambil data user...');
        this.token = token;
        this.isAuthenticated = true;
        this.getMe();
      }
    },
    
    /**
     * Mendaftarkan pengguna baru
     */
    async register(userData: { 
      username: string; 
      email: string; 
      password: string;
      firstName?: string;
      lastName?: string;
    }): Promise<{ success: boolean; message: string }> {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await axios.post(`/auth/register`, userData);
        
        if (response.data.success) {
          // Simpan data autentikasi
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          localStorage.setItem('user-token', response.data.data.token);
          localStorage.setItem('refresh-token', response.data.data.refreshToken);
          
          // Perbarui state
          this.user = response.data.data.user;
          this.token = response.data.data.token;
          this.refreshToken = response.data.data.refreshToken;
          this.isAuthenticated = true;
          
          // Redirect ke dashboard
          router.push('/dashboard');
          
          return {
            success: true,
            message: 'Registrasi berhasil!'
          };
        }
        
        return {
          success: false,
          message: 'Terjadi kesalahan tak terduga'
        };
      } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Terjadi kesalahan saat registrasi';
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Login pengguna
     */
    async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await axios.post(`/auth/login`, {
          email,
          password
        });
        
        if (response.data.success) {
          // Simpan data autentikasi
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          localStorage.setItem('user-token', response.data.data.token);
          localStorage.setItem('refresh-token', response.data.data.refreshToken);
          
          // Perbarui state
          this.user = response.data.data.user;
          this.token = response.data.data.token;
          this.refreshToken = response.data.data.refreshToken;
          this.isAuthenticated = true;
          
          console.log('Login berhasil, data user:', this.user);
          
          // Ambil data user terbaru dari server
          await this.getMe();
          
          // Redirect sesuai query atau ke dashboard
          const redirectPath = router.currentRoute.value.query.redirect as string || '/dashboard';
          console.log('Redirecting to:', redirectPath);
          router.push(redirectPath);
          
          return {
            success: true,
            message: 'Login berhasil!'
          };
        }
        
        return {
          success: false,
          message: 'Terjadi kesalahan tak terduga'
        };
      } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Email atau password salah';
        this.error = errorMessage;
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Login dengan Google
     */
    async loginWithGoogle(): Promise<GoogleLoginResult> {
      try {
        console.log('Memulai proses login Google dengan redirect...');
        
        // Redirect langsung ke endpoint Google Auth
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
        
        // Return dummy promise untuk kompatibilitas tipe
        return Promise.resolve({ 
          token: '', 
          refreshToken: '', 
          user: null 
        });
      } catch (error) {
        console.error('Error saat memulai login Google:', error);
        throw error;
      }
    },
    
    /**
     * Handle callback dari OAuth (Google)
     */
    async handleOAuthCallback(token: string, refreshToken: string, userData: User): Promise<void> {
      try {
        console.log('Handling OAuth callback...');
        
        // Validasi data
        if (!token || !refreshToken || !userData) {
          throw new Error('Data autentikasi tidak lengkap');
        }
        
        // Simpan data autentikasi
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('user-token', token);
        localStorage.setItem('refresh-token', refreshToken);
        
        // Perbarui state
        this.user = userData;
        this.token = token;
        this.refreshToken = refreshToken;
        this.isAuthenticated = true;
        
        console.log('OAuth callback berhasil, user:', userData.email);
        
        // Ambil data user terbaru dari server
        await this.getMe();
        
        // Tidak perlu redirect di sini, karena telah dilakukan di OAuthCallback.vue
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        this.error = error instanceof Error ? error.message : 'Terjadi kesalahan saat proses autentikasi';
        
        // Hapus data autentikasi jika ada error
        localStorage.removeItem('user');
        localStorage.removeItem('user-token');
        localStorage.removeItem('refresh-token');
        
        this.user = null;
        this.token = null;
        this.refreshToken = null;
        this.isAuthenticated = false;
        
        throw error; // Re-throw untuk ditangani oleh komponen
      }
    },
    
    // Logout user
    async logout(): Promise<void> {
      try {
        // Hapus token dari localStorage
        localStorage.removeItem('user-token');
        
        // Reset state
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        
        // Redirect ke halaman login
        router.push('/login');
        
        // Tampilkan toast sukses
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            message: 'Berhasil logout',
            type: 'success'
          }
        }));
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
    
    async getMe(): Promise<void> {
      try {
        if (!this.token) return;
        
        console.log('Mengambil data user dari server...');
        const response = await axios.get(`/auth/me`);
        
        if (response.data.success) {
          console.log('Data user berhasil diambil:', response.data.data);
          this.user = response.data.data.user;
          localStorage.setItem('user', JSON.stringify(this.user));
          
          // Pastikan user memiliki properti profile
          if (this.user && !this.user.profile) {
            this.user.profile = {
              firstName: this.user.username || '',
              lastName: ''
            };
          }
        }
      } catch (error: unknown) {
        console.error('Error saat mengambil data user:', error);
        if ((error as { response?: { status?: number } }).response?.status === 401) {
          // Token tidak valid, coba refresh atau logout
          const refreshed = await this.refreshUserToken();
          if (refreshed) {
            // Jika refresh berhasil, coba ambil data user lagi
            this.getMe();
          }
        }
      }
    },
    
    async refreshUserToken(): Promise<boolean | undefined> {
      try {
        if (!this.refreshToken) {
          console.log('Tidak ada refresh token yang tersedia');
          await this.logout();
          return false;
        }
        
        console.log('Mencoba refresh token...');
        const response = await axios.post(`/auth/refresh`, {
          refreshToken: this.refreshToken
        });
        
        if (response.data.success) {
          // Update token
          this.token = response.data.data.token;
          if (this.token) {
            localStorage.setItem('user-token', this.token);
            console.log('Token berhasil diperbarui');
          }
          
          return true;
        }
        
        console.log('Gagal refresh token: respons tidak sukses');
        return false;
      } catch (error) {
        // Jika gagal refresh token, logout user
        console.error('Error saat refresh token:', error);
        await this.logout();
        return false;
      }
    }
  }
}); 