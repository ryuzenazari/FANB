<template>
  <div class="register-view">
    <div class="register-container">
      <!-- Logo and Branding -->
      <div class="brand">
        <div class="logo">
          <span class="logo-text">FANB</span>
        </div>
        <p class="tagline">Focus. Arrange. Notify. Balance.</p>
      </div>

      <!-- Register Form -->
      <div class="register-card">
        <div class="register-header">
          <h1>Buat Akun Baru</h1>
          <p>Mulai perjalanan produktivitas Anda sekarang</p>
        </div>

        <form class="register-form" @submit.prevent="handleRegister">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Nama Depan</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="firstName" 
                  placeholder="Nama depan" 
                  required 
                />
              </div>
            </div>
            <div class="form-group">
              <label for="lastName">Nama Belakang</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="lastName" 
                  placeholder="Nama belakang" 
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                placeholder="Username" 
                required 
              />
            </div>
          </div>

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
                placeholder="Buat password" 
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
            <div class="password-strength" :class="passwordStrengthClass">
              <div class="strength-bar"></div>
              <div class="strength-bar"></div>
              <div class="strength-bar"></div>
              <div class="strength-bar"></div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Konfirmasi Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                v-model="confirmPassword" 
                placeholder="Konfirmasi password" 
                required 
              />
              <button 
                type="button" 
                class="toggle-password" 
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div v-if="confirmPassword" class="password-confirmation" :class="{ 'match': passwordMatch, 'mismatch': !passwordMatch }">
              <span class="confirmation-icon">{{ passwordMatch ? '✓' : '✗' }}</span>
              <span class="confirmation-text">{{ passwordMatchText }}</span>
            </div>
          </div>

          <div class="form-group checkbox-group">
            <div class="checkbox-wrapper">
              <input type="checkbox" id="terms" v-model="agreeTerms" required />
              <label for="terms">
                Saya setuju dengan <router-link to="/terms">Syarat & Ketentuan</router-link> dan <router-link to="/privacy">Kebijakan Privasi</router-link>
              </label>
            </div>
          </div>

          <button type="submit" class="register-button" :disabled="!formValid">
            <span>Daftar</span>
            <span class="button-icon">→</span>
          </button>

          <div class="divider">
            <span>atau daftar dengan</span>
          </div>

          <div class="social-register">
            <button type="button" class="social-button google">
              <span class="social-icon">G</span>
              <span>Google</span>
            </button>
            <button type="button" class="social-button apple">
              <span class="social-icon">A</span>
              <span>Apple</span>
            </button>
          </div>
        </form>

        <div class="login-prompt">
          <p>Sudah punya akun? <router-link to="/login">Masuk</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useRouter } from 'vue-router';

// Store dan router
const authStore = useAuthStore();
const router = useRouter();

// Form data
const firstName = ref('');
const lastName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Computed properties
const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

// Validasi password konfirmasi
const passwordMatch = computed(() => {
  if (!confirmPassword.value) return null; // Belum diisi
  return confirmPassword.value === password.value;
});

const passwordMatchText = computed(() => {
  if (confirmPassword.value === '') return '';
  return passwordMatch.value ? 'Password cocok' : 'Password tidak cocok';
});

// Password strength
const passwordStrength = computed(() => {
  if (!password.value) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.value.length >= 8) strength += 1;
  
  // Contains uppercase
  if (/[A-Z]/.test(password.value)) strength += 1;
  
  // Contains number
  if (/[0-9]/.test(password.value)) strength += 1;
  
  // Contains special character
  if (/[^A-Za-z0-9]/.test(password.value)) strength += 1;
  
  return strength;
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (!password.value) return 'Masukkan password';
  if (strength === 0) return 'Sangat lemah';
  if (strength === 1) return 'Lemah';
  if (strength === 2) return 'Sedang';
  if (strength === 3) return 'Kuat';
  return 'Sangat kuat';
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (!password.value) return '';
  if (strength === 0) return 'very-weak';
  if (strength === 1) return 'weak';
  if (strength === 2) return 'medium';
  if (strength === 3) return 'strong';
  return 'very-strong';
});

// Form validation
const formValid = computed(() => {
  return (
    firstName.value.trim() !== '' &&
    username.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value.trim() !== '' &&
    password.value === confirmPassword.value &&
    agreeTerms.value
  );
});

// Form submission
const handleRegister = async () => {
  if (!formValid.value) return;
  
  const userData = {
    username: username.value,
    email: email.value,
    password: password.value,
    profile: {
      firstName: firstName.value,
      lastName: lastName.value
    }
  };
  
  const result = await authStore.register(userData);
  
  if (!result.success) {
    // Tampilkan pesan error jika diperlukan
    console.error(result.message);
  }
};
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.register-container {
  width: 100%;
  max-width: 500px;
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

/* Register Card */
.register-card {
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

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  color: #f9fafb;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Form Styling */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
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

/* Password Strength Indicator */
.password-strength {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Password Confirmation Indicator */
.password-confirmation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  animation: fadeIn 0.3s ease-out;
}

.password-confirmation.match {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.password-confirmation.mismatch {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.confirmation-icon {
  font-weight: bold;
}

.strength-bar {
  height: 4px;
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.strength-text {
  font-size: 0.75rem;
  color: #9ca3af;
  min-width: 80px;
  text-align: right;
}

.password-strength.very-weak .strength-bar:nth-child(1) {
  background-color: #ef4444;
}

.password-strength.weak .strength-bar:nth-child(1),
.password-strength.weak .strength-bar:nth-child(2) {
  background-color: #f59e0b;
}

.password-strength.medium .strength-bar:nth-child(1),
.password-strength.medium .strength-bar:nth-child(2),
.password-strength.medium .strength-bar:nth-child(3) {
  background-color: #10b981;
}

.password-strength.strong .strength-bar,
.password-strength.very-strong .strength-bar {
  background-color: #3b82f6;
}

.checkbox-group {
  margin-top: 0.5rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.checkbox-wrapper input[type="checkbox"] {
  margin-top: 0.25rem;
  accent-color: #3b82f6;
}

.checkbox-wrapper label {
  color: #e5e7eb;
  font-size: 0.875rem;
  line-height: 1.4;
}

.checkbox-wrapper a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s ease;
}

.checkbox-wrapper a:hover {
  color: #60a5fa;
  text-decoration: underline;
}

.register-button {
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

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: linear-gradient(to right, #9ca3af, #6b7280);
}

.register-button:not(:disabled)::before {
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

.register-button:not(:disabled):hover::before {
  left: 100%;
}

.register-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

.button-icon {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.register-button:not(:disabled):hover .button-icon {
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

.social-register {
  display: flex;
  gap: 1rem;
}

.social-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #e5e7eb;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.social-icon {
  font-weight: 700;
}

.login-prompt {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
}

.login-prompt a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-prompt a:hover {
  color: #60a5fa;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .register-container {
    max-width: 100%;
  }
  
  .register-card {
    padding: 1.5rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .social-register {
    flex-direction: column;
  }
}
</style> 