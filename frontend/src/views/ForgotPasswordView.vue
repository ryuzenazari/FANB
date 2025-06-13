<script setup lang="ts">
import { ref } from 'vue'
import axios from '../plugins/axios'

const email = ref('')
const loading = ref(false)
const isSuccess = ref(false)
const error = ref('')

const handleSubmit = async () => {
  // Reset states
  error.value = ''
  
  // Validasi email
  if (!email.value) {
    error.value = 'Email harus diisi'
    return
  }
  
  // Validasi format email sederhana
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Format email tidak valid'
    return
  }
  
  try {
    loading.value = true
    
    const response = await axios.post('/auth/forgot-password', {
      email: email.value
    })
    
    if (response.data.success) {
      isSuccess.value = true
    } else {
      error.value = response.data.error?.message || 'Terjadi kesalahan saat mengirim email reset password'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || 'Terjadi kesalahan saat mengirim email reset password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="forgot-view">
    <div class="forgot-container">
      <!-- Logo and Branding -->
      <div class="brand">
        <div class="logo">
          <span class="logo-text">FANB</span>
        </div>
        <p class="tagline">Focus. Arrange. Notify. Balance.</p>
      </div>

      <!-- Forgot Password Card -->
      <div class="forgot-card">
        <div class="forgot-header">
          <h1>Lupa Password</h1>
          <p>Masukkan email Anda untuk mendapatkan link reset password</p>
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
        <form v-if="!loading && !isSuccess" @submit.prevent="handleSubmit" class="forgot-form">
          <div class="form-group">
            <label for="email">Alamat Email</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input 
                type="email" 
                id="email" 
                name="email"
                v-model="email" 
                autocomplete="email"
                placeholder="email@anda.com" 
                required 
              />
            </div>
          </div>

          <button type="submit" class="forgot-button">
            <span>Kirim Link Reset Password</span>
            <span class="button-icon">→</span>
          </button>
          
          <div class="login-link">
            <router-link to="/login" class="link">
              Kembali ke halaman login
            </router-link>
          </div>
        </form>

        <!-- Success state -->
        <div v-if="isSuccess" class="success-state">
          <div class="success-box">
            <div class="success-icon">✅</div>
            <div class="success-content">
              <h3>Email Terkirim</h3>
              <p>
                Kami telah mengirim email yang berisi instruksi untuk reset password Anda. Silakan periksa kotak masuk atau folder spam Anda.
              </p>
            </div>
          </div>

          <div class="login-link">
            <router-link to="/login" class="link">
              Kembali ke halaman login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forgot-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.forgot-container {
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

/* Forgot Password Card */
.forgot-card {
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

.forgot-header {
  text-align: center;
  margin-bottom: 2rem;
}

.forgot-header h1 {
  color: #f9fafb;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.forgot-header p {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Form Styling */
.forgot-form {
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

.forgot-button {
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

.forgot-button::before {
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

.forgot-button:hover::before {
  left: 100%;
}

.forgot-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

.button-icon {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.forgot-button:hover .button-icon {
  transform: translateX(4px);
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
}

.link:hover {
  color: #60a5fa;
  text-decoration: underline;
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

/* Responsive */
@media (max-width: 480px) {
  .forgot-container {
    max-width: 100%;
  }
  
  .forgot-card {
    padding: 1.5rem;
  }
}
</style> 