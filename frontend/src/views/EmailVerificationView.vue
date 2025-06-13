<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios'

const route = useRoute()
const router = useRouter()
const token = ref(route.params.token?.toString() || '')
const loading = ref(true)
const isSuccess = ref(false)
const error = ref('')
const resendLoading = ref(false)
const resendSuccess = ref(false)
const email = ref('')

onMounted(async () => {
  if (!token.value) {
    error.value = 'Token verifikasi email tidak valid'
    loading.value = false
    return
  }

  try {
    const response = await axios.post('/auth/verify-email', { token: token.value })
    
    if (response.data.success) {
      isSuccess.value = true
      
      // Ambil email untuk keperluan resend jika diperlukan
      if (response.data.email) {
        email.value = response.data.email
      }
    } else {
      error.value = response.data.error?.message || 'Token verifikasi tidak valid atau telah kadaluarsa'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || 'Terjadi kesalahan saat memverifikasi email'
  } finally {
    loading.value = false
  }
})

const resendVerification = async () => {
  resendLoading.value = true
  resendSuccess.value = false

  try {
    const response = await axios.post('/auth/resend-verification', { email: email.value })
    
    if (response.data.success) {
      resendSuccess.value = true
    } else {
      error.value = response.data.error?.message || 'Gagal mengirim ulang email verifikasi'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || 'Gagal mengirim ulang email verifikasi'
  } finally {
    resendLoading.value = false
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="verify-view">
    <div class="verify-container">
      <!-- Logo and Branding -->
      <div class="brand">
        <div class="logo">
          <span class="logo-text">FANB</span>
        </div>
        <p class="tagline">Focus. Arrange. Notify. Balance.</p>
      </div>

      <!-- Verification Card -->
      <div class="verify-card">
        <div class="verify-header">
          <h1>Verifikasi Email</h1>
          <p>Memverifikasi alamat email akun FANB Anda</p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>

        <!-- Error state -->
        <div v-if="error && !isSuccess && !loading" class="error-message">
          <p>{{ error }}</p>
        </div>

        <!-- Success state -->
        <div v-if="isSuccess && !loading" class="success-state">
          <div class="success-box">
            <div class="success-icon">✅</div>
            <div class="success-content">
              <h3>Email Berhasil Diverifikasi</h3>
              <p>
                Terima kasih! Alamat email Anda telah berhasil diverifikasi. Sekarang Anda dapat mengakses semua fitur FANB.
              </p>
            </div>
          </div>

          <button @click="goToDashboard" class="verify-button">
            <span>Lanjutkan ke Dashboard</span>
            <span class="button-icon">→</span>
          </button>
        </div>

        <!-- Error with resend option -->
        <div v-if="error && !isSuccess && !loading && email" class="resend-section">
          <p class="resend-text">
            Link verifikasi kadaluarsa atau tidak valid? Kirim ulang email verifikasi.
          </p>
          
          <!-- Resend success message -->
          <div v-if="resendSuccess" class="success-box">
            <div class="success-icon">✅</div>
            <div class="success-content">
              <h3>Email Terkirim</h3>
              <p>
                Email verifikasi baru telah dikirim ke {{ email }}. Silakan periksa kotak masuk Anda.
              </p>
            </div>
          </div>
          
          <button @click="resendVerification"
                  :disabled="resendLoading"
                  class="resend-button">
            <span v-if="resendLoading" class="loading-text">
              <div class="spinner-small"></div>
              Mengirim...
            </span>
            <span v-else>
              Kirim Ulang Email Verifikasi
              <span class="button-icon">✉️</span>
            </span>
          </button>
          
          <div class="login-link">
            <button @click="goToLogin" class="link">
              Kembali ke halaman login
            </button>
          </div>
        </div>

        <!-- Default error action -->
        <div v-else-if="error && !isSuccess && !loading" class="default-error">
          <button @click="goToLogin" class="verify-button">
            <span>Kembali ke Halaman Login</span>
            <span class="button-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verify-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.verify-container {
  width: 100%;
  max-width: 420px;
  z-index: 10;
  position: relative;
  margin-top: 2rem;
}

/* Logo and Branding */
.brand {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  color: #e5e7eb;
  font-size: 1rem;
  opacity: 0.8;
}

/* Verification Card */
.verify-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.verify-header {
  text-align: center;
  margin-bottom: 2rem;
}

.verify-header h1 {
  color: #f9fafb;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.verify-header p {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Loading State */
.loading {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error Message */
.error-message {
  background: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.error-message p {
  color: #fca5a5;
  font-size: 0.875rem;
  margin: 0;
}

/* Success Box */
.success-box {
  display: flex;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.success-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #10b981;
}

.success-content h3 {
  color: #f9fafb;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.success-content p {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
}

/* Buttons */
.verify-button, .resend-button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.verify-button::before, .resend-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s ease;
}

.verify-button:hover::before, .resend-button:hover::before {
  left: 100%;
}

.verify-button:hover, .resend-button:hover:not([disabled]) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

.resend-button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-icon {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.verify-button:hover .button-icon {
  transform: translateX(4px);
}

/* Resend section */
.resend-section {
  margin-top: 2rem;
}

.resend-text {
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.resend-button {
  margin-bottom: 1rem;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.5);
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Login Link */
.login-link {
  text-align: center;
  margin-top: 1rem;
}

.link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.link:hover {
  color: #60a5fa;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .verify-container {
    max-width: 100%;
  }
  
  .verify-card {
    padding: 1.5rem;
  }
}
</style> 