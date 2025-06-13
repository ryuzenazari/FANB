<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const setupMode = ref(false)
const verifyMode = ref(false)
const qrCodeUrl = ref('')
const secretKey = ref('')
const verificationCode = ref('')
const error = ref('')
const success = ref(false)

// Untuk verifikasi otomatis jika ada token dari URL
const token = ref(route.query.token?.toString() || '')
const userId = ref(route.query.userId?.toString() || localStorage.getItem('userId') || '')

// Referensi untuk input otomatis fokus
const codeInput = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  // Cek mode halaman berdasarkan query
  if (route.query.setup === 'true') {
    setupMode.value = true
    await generateSetup()
  } else if (route.query.verify === 'true') {
    verifyMode.value = true
    nextTick(() => {
      if (codeInput.value) {
        codeInput.value.focus()
      }
    })
  }
})

// Fungsi untuk menghasilkan setup 2FA
async function generateSetup() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.post('/auth/2fa/setup', { userId: userId.value })
    
    if (response.data.success) {
      qrCodeUrl.value = response.data.qrCodeUrl
      secretKey.value = response.data.secretKey
    } else {
      error.value = response.data.error?.message || 'Gagal menghasilkan kode QR untuk 2FA'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || 'Terjadi kesalahan saat setup 2FA'
  } finally {
    loading.value = false
  }
}

// Fungsi untuk memverifikasi kode 2FA
async function verifyCode() {
  loading.value = true
  error.value = ''
  
  if (!verificationCode.value) {
    error.value = 'Kode verifikasi harus diisi'
    loading.value = false
    return
  }
  
  try {
    const payload = {
      userId: userId.value,
      code: verificationCode.value,
      token: token.value
    }
    
    const response = await axios.post(
      setupMode.value ? '/auth/2fa/confirm-setup' : '/auth/2fa/verify', 
      payload
    )
    
    if (response.data.success) {
      success.value = true
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      // Arahkan ke dashboard setelah berhasil
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      error.value = response.data.error?.message || 'Kode verifikasi tidak valid'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || 'Terjadi kesalahan saat verifikasi kode 2FA'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="tfa-view">
    <div class="tfa-container">
      <!-- Logo and Branding -->
      <div class="brand">
        <div class="logo">
          <span class="logo-text">FANB</span>
        </div>
        <p class="tagline">Focus. Arrange. Notify. Balance.</p>
      </div>

      <!-- Two Factor Authentication Card -->
      <div class="tfa-card">
        <div class="tfa-header">
          <h1>
            <span v-if="setupMode">Setup Autentikasi Dua Faktor</span>
            <span v-else-if="verifyMode">Verifikasi Autentikasi Dua Faktor</span>
            <span v-else>Autentikasi Dua Faktor</span>
          </h1>
          <p>
            <span v-if="setupMode">Tingkatkan keamanan akun Anda dengan 2FA</span>
            <span v-else-if="verifyMode">Masukkan kode verifikasi dari aplikasi autentikator Anda</span>
            <span v-else>Lindungi akun Anda dengan lapisan keamanan tambahan</span>
          </p>
        </div>

        <!-- Error message -->
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>

        <!-- Success message -->
        <div v-if="success" class="success-box">
          <div class="success-icon">✅</div>
          <div class="success-content">
            <h3>
              <span v-if="setupMode">2FA Berhasil Diaktifkan</span>
              <span v-else>Verifikasi Berhasil</span>
            </h3>
            <p v-if="setupMode">
              Autentikasi dua faktor telah berhasil diaktifkan untuk akun Anda. Setiap kali login, Anda akan diminta memasukkan kode dari aplikasi autentikator.
            </p>
            <p v-else>
              Kode verifikasi valid. Anda akan dialihkan ke dashboard.
            </p>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>

        <!-- Setup 2FA mode -->
        <div v-if="setupMode && !loading && !success" class="setup-mode">
          <div class="setup-instructions">
            <p>
              Untuk mengaktifkan autentikasi dua faktor, ikuti langkah-langkah berikut:
            </p>
            <ol>
              <li>Download aplikasi autentikator di ponsel Anda (Google Authenticator, Authy, atau sejenisnya)</li>
              <li>Scan kode QR berikut dengan aplikasi autentikator</li>
              <li>Atau, masukkan kode rahasia ini secara manual: <span class="secret-key">{{ secretKey }}</span></li>
              <li>Masukkan kode 6 digit yang muncul di aplikasi autentikator Anda</li>
            </ol>
          </div>
          
          <!-- QR Code -->
          <div v-if="qrCodeUrl" class="qr-container">
            <img :src="qrCodeUrl" alt="QR Code untuk Two Factor Authentication" class="qr-code" />
          </div>
          
          <div class="form-group">
            <label for="verification-code">Kode Verifikasi</label>
            <div class="input-wrapper">
              <span class="input-icon">🔐</span>
              <input 
                id="verification-code" 
                v-model="verificationCode"
                type="text"
                ref="codeInput" 
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                autocomplete="one-time-code"
                required
                placeholder="000000"
              />
            </div>
          </div>

          <button @click="verifyCode" class="tfa-button">
            <span>Aktifkan 2FA</span>
            <span class="button-icon">→</span>
          </button>
        </div>

        <!-- Verify 2FA mode -->
        <div v-if="verifyMode && !loading && !success" class="verify-mode">
          <div class="verify-instructions">
            <p>
              Masukkan kode 6 digit dari aplikasi autentikator Anda untuk melanjutkan.
            </p>
          </div>
          
          <div class="form-group">
            <label for="verification-code">Kode Verifikasi</label>
            <div class="input-wrapper">
              <span class="input-icon">🔐</span>
              <input 
                id="verification-code" 
                v-model="verificationCode"
                type="text" 
                ref="codeInput"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                autocomplete="one-time-code"
                required
                placeholder="000000"
              />
            </div>
          </div>

          <button @click="verifyCode" class="tfa-button">
            <span>Verifikasi</span>
            <span class="button-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tfa-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.tfa-container {
  width: 100%;
  max-width: 480px;
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

/* TFA Card */
.tfa-card {
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

.tfa-header {
  text-align: center;
  margin-bottom: 2rem;
}

.tfa-header h1 {
  color: #f9fafb;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.tfa-header p {
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

/* Setup/Verify Mode */
.setup-mode, .verify-mode {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setup-instructions, .verify-instructions {
  color: #e5e7eb;
  font-size: 0.875rem;
}

.setup-instructions ol {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

.setup-instructions li {
  margin-bottom: 0.75rem;
}

.secret-key {
  font-family: monospace;
  font-weight: 600;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

/* QR Code */
.qr-container {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.qr-code {
  height: 180px;
  width: 180px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background-color: white;
  padding: 0.5rem;
}

/* Form Styling */
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
  font-size: 1.25rem;
  letter-spacing: 0.5em;
  text-align: center;
  font-family: monospace;
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.input-wrapper input::placeholder {
  color: #6b7280;
  letter-spacing: 0.25em;
}

/* Button */
.tfa-button {
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

.tfa-button::before {
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

.tfa-button:hover::before {
  left: 100%;
}

.tfa-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

.button-icon {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.tfa-button:hover .button-icon {
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 480px) {
  .tfa-container {
    max-width: 100%;
    padding: 0 1rem;
  }
  
  .tfa-card {
    padding: 1.5rem;
  }
  
  .input-wrapper input {
    font-size: 1rem;
    letter-spacing: 0.25em;
  }
}
</style> 