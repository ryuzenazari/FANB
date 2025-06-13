<template>
  <div class="login-view">
    <div class="login-container">
      <!-- Logo and Branding -->
      <div class="brand">
        <div class="logo">
          <span class="logo-text">FANB</span>
        </div>
        <p class="tagline">Focus. Arrange. Notify. Balance.</p>
      </div>

      <!-- Login Form -->
      <div class="login-card">
        <div class="login-header">
          <h1>Selamat Datang Kembali</h1>
          <p>Masuk untuk melanjutkan perjalanan produktivitas Anda</p>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="error-alert">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                placeholder="email@anda.com" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                placeholder="Masukkan password" 
                required 
              />
              <button 
                type="button" 
                class="toggle-password" 
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="rememberMe" />
              <label for="remember">Ingat saya</label>
            </div>
            <router-link to="/forgot-password" class="forgot-password">Lupa password?</router-link>
          </div>

          <button type="submit" class="login-button" :disabled="loading">
            <span v-if="!loading">Masuk</span>
            <span v-else>Loading...</span>
            <span v-if="!loading" class="button-icon">→</span>
          </button>

          <div class="divider">
            <span>atau masuk dengan</span>
          </div>

          <div class="social-login">
            <button 
              type="button" 
              class="social-button google"
              @click="handleGoogleLogin"
              :disabled="loading"
            >
              <span class="social-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285f4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34a853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#fbbc05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#ea4335"/>
                </svg>
              </span>
              <span>Google</span>
            </button>
          </div>
        </form>

        <div class="signup-prompt">
          <p>Belum punya akun? <router-link to="/register">Daftar sekarang</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'vue-router';
import { useToast } from '../../composables/useToast';

// Store dan router
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

// Form data
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

// Computed properties
const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

// Form submission
const handleLogin = async () => {
  console.log('Mencoba login dengan:', { email: email.value, passwordLength: password.value.length });
  const result = await authStore.login(email.value, password.value);
  
  if (!result.success) {
    // Error sudah dihandle di store dan ditampilkan via error computed property
    console.error('Login gagal:', result.message);
  } else {
    console.log('Login berhasil, token:', localStorage.getItem('user-token'));
  }
};

// Google login
const handleGoogleLogin = async () => {
  try {
    console.log('Memulai proses login dengan Google...');
    // Sekarang loginWithGoogle melakukan redirect langsung ke Google
    await authStore.loginWithGoogle();
    // Tidak perlu menampilkan toast atau melakukan redirect karena
    // akan ditangani oleh callback dari Google
  } catch (error: unknown) {
    console.error('Error saat login dengan Google:', error);
    toast.error('Gagal memulai proses login dengan Google. Silakan coba lagi.');
  }
};
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

/* Error Alert Styling */
.error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #fca5a5;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  animation: fadeInShake 0.5s ease-out;
}

@keyframes fadeInShake {
  0% {
    opacity: 0;
    transform: translateX(0);
  }
  20% {
    opacity: 1;
    transform: translateX(-5px);
  }
  40% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
  100% {
    transform: translateX(0);
  }
}

.error-icon {
  font-size: 1rem;
}

.login-container {
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

/* Login Card */
.login-card {
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

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #f9fafb;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Form Styling */
.login-form {
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

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e5e7eb;
}

.remember-me input[type="checkbox"] {
  accent-color: #3b82f6;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #60a5fa;
  text-decoration: underline;
}

.login-button {
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

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-button::before {
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

.login-button:not(:disabled):hover::before {
  left: 100%;
}

.login-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

.button-icon {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.login-button:not(:disabled):hover .button-icon {
  transform: translateX(4px);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 0.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.divider::before {
  margin-right: 0.5rem;
}

.divider::after {
  margin-left: 0.5rem;
}

.social-login {
  display: flex;
  justify-content: center;
  width: 100%;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #e5e7eb;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.social-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.social-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.social-button.google {
  background: rgba(255, 255, 255, 0.1);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.signup-prompt {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
}

.signup-prompt a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.signup-prompt a:hover {
  color: #60a5fa;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
  }
  
  .login-card {
    padding: 1.5rem;
  }
}
</style> 