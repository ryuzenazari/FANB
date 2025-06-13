<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios'

const route = useRoute()
const router = useRouter()
const token = ref(route.params.token?.toString() || '')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const isSuccess = ref(false)
const error = ref('')
const tokenValid = ref(true)

// Validasi token saat halaman dimuat
onMounted(async () => {
  if (!token.value) {
    tokenValid.value = false
    error.value = 'Token reset password tidak valid'
    return
  }
  
  try {
    // Verifikasi token valid
    loading.value = true
    const response = await axios.post('/auth/verify-reset-token', { 
      token: token.value 
    })
    
    if (!response.data.success) {
      tokenValid.value = false
      error.value = response.data.error?.message || 'Token tidak valid atau telah kadaluarsa'
    }
  } catch (err: any) {
    tokenValid.value = false
    error.value = err.response?.data?.error?.message || 'Token tidak valid atau telah kadaluarsa'
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  // Reset error
  error.value = ''
  
  // Validasi password
  if (!password.value) {
    error.value = 'Password harus diisi'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password minimal 8 karakter'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Konfirmasi password tidak sesuai'
    return
  }
  
  try {
    loading.value = true
    
    const response = await axios.post('/auth/reset-password', {
      token: token.value,
      password: password.value
    })
    
    if (response.data.success) {
      isSuccess.value = true
    } else {
      error.value = response.data.error?.message || 'Terjadi kesalahan saat reset password'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || 'Terjadi kesalahan saat reset password'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="reset-view">
    <div class="reset-container">
      <!-- Logo and Branding -->
      <div class="brand">
        <div class="logo">
          <span class="logo-text">FANB</span>
        </div>
        <p class="tagline">Focus. Arrange. Notify. Balance.</p>
      </div>

      <!-- Reset Password Card -->
      <div class="reset-card">
        <div class="reset-header">
          <h1>Reset Password</h1>
          <p>Buat password baru untuk akun Anda</p>
        </div>

        <!-- Error message -->
        <div v-if="error && !isSuccess" class="error-message">
          <p>{{ error }}</p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>

        <!-- Form -->
        <form v-if="!loading && !isSuccess && tokenValid" @submit.prevent="handleSubmit" class="reset-form">
          <div class="form-group">
            <label for="password">Password Baru</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                placeholder="Masukkan password baru" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Konfirmasi Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="confirmPassword" 
                placeholder="Konfirmasi password baru" 
                required 
              />
            </div>
          </div>

          <button type="submit" class="reset-button">
            <span>Reset Password</span>
            <span class="button-icon">→</span>
          </button>
        </form>

        <!-- Token invalid state -->
        <div v-if="!loading && !tokenValid && !isSuccess" class="invalid-token">
          <div class="error-box">
            <div class="error-icon">❌</div>
            <div class="error-content">
              <h3>Token tidak valid</h3>
              <p>Link reset password tidak valid atau sudah kadaluarsa. Silakan minta link reset password baru.</p>
            </div>
          </div>
          <button @click="goToLogin" class="login-return-button">
            <span>Kembali ke Halaman Login</span>
            <span class="button-icon">→</span>
          </button>
        </div>

        <!-- Success state -->
        <div v-if="isSuccess" class="success-state">
          <div class="success-box">
            <div class="success-icon">✅</div>
            <div class="success-content">
              <h3>Password Berhasil Direset</h3>
              <p>Password Anda telah berhasil diubah. Silakan login menggunakan password baru Anda.</p>
            </div>
          </div>
          <button @click="goToLogin" class="login-return-button">
            <span>Masuk Sekarang</span>
            <span class="button-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reset-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.reset-container {
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

/* Reset Password Card */
.reset-card {
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

.reset-header {
  text-align: center;
  margin-bottom: 2rem;
}

.reset-header h1 {
  color: #f9fafb;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.reset-header p {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Form Styling */
.reset-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e5e7eb;
  font-size: 0.875rem;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  font-size: 1rem;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #f9fafb;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.input-wrapper input::placeholder {
  color: #6b7280;
}

.reset-button, .login-return-button {
  display: flex;
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

.reset-button::before, .login-return-button::before {
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

.reset-button:hover::before, .login-return-button:hover::before {
  left: 100%;
}

.reset-button:hover, .login-return-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

.button-icon {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.reset-button:hover .button-icon, .login-return-button:hover .button-icon {
  transform: translateX(4px);
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Success and Error Boxes */
.error-box, .success-box {
  display: flex;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.error-icon, .success-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.error-icon {
  color: #ef4444;
}

.success-icon {
  color: #10b981;
}

.error-content h3, .success-content h3 {
  color: #f9fafb;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.error-content p, .success-content p {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .reset-container {
    max-width: 100%;
  }
  
  .reset-card {
    padding: 1.5rem;
  }
}
</style> 