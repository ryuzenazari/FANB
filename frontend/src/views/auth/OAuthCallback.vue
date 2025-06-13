<template>
  <div class="oauth-callback">
    <div class="callback-container">
      <div class="loading-spinner" v-if="loading">
        <div class="spinner"></div>
        <p>Menyelesaikan proses login...</p>
      </div>
      
      <div class="error-message" v-if="error">
        <h2>Terjadi Kesalahan</h2>
        <p>{{ error }}</p>
        <router-link to="/login" class="back-button">Kembali ke Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import axios from '../../plugins/axios';
import { useToast } from '../../composables/useToast';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    // Ambil token dari query params
    const token = route.query.token as string;
    const refreshToken = route.query.refreshToken as string;
    const userId = route.query.userId as string;
    
    console.log('OAuth Callback - Token:', token ? 'tersedia' : 'tidak tersedia');
    console.log('OAuth Callback - Refresh Token:', refreshToken ? 'tersedia' : 'tidak tersedia');
    console.log('OAuth Callback - User ID:', userId);
    
    if (!token || !refreshToken || !userId) {
      error.value = 'Parameter autentikasi tidak lengkap';
      loading.value = false;
      return;
    }
    
    // Simpan token sementara untuk request
    localStorage.setItem('user-token', token);
    localStorage.setItem('refresh-token', refreshToken);
    
    // Ambil data user
    const response = await axios.get(`/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.data.success || !response.data.data.user) {
      throw new Error('Data pengguna tidak valid');
    }
    
    // Simpan ke auth store
    await authStore.handleOAuthCallback(token, refreshToken, response.data.data.user);
    
    // Tampilkan notifikasi sukses
    toast.success('Login dengan Google berhasil!');
    
    // Redirect ke dashboard
    router.push('/dashboard');
  } catch (err) {
    console.error('Error during OAuth callback:', err);
    error.value = err instanceof Error ? err.message : 'Terjadi kesalahan saat proses autentikasi';
    loading.value = false;
    
    // Hapus token jika ada error
    localStorage.removeItem('user-token');
    localStorage.removeItem('refresh-token');
  }
});
</script>

<style scoped>
.oauth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f172a;
}

.callback-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(79, 70, 229, 0.3);
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #e5e7eb;
  font-size: 1rem;
}

.error-message {
  color: #e5e7eb;
}

.error-message h2 {
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-message p {
  margin-bottom: 2rem;
}

.back-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}
</style> 