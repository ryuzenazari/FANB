<template>
  <div class="static-page contact-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Hubungi Kami</h1>
        <p class="page-subtitle">Kami siap membantu menjawab pertanyaan dan mendengarkan masukan Anda</p>
      </div>

      <div class="contact-grid">
        <div class="contact-info">
          <div class="info-section">
            <h2>Informasi Kontak</h2>
            <p>Tim dukungan kami siap membantu Anda dengan pertanyaan, masalah teknis, atau umpan balik apa pun yang Anda miliki.</p>
            
            <ul class="contact-list">
              <li class="contact-item">
                <div class="contact-icon">📍</div>
                <div class="contact-content">
                  <h3>Alamat</h3>
                  <p>Jl. Jendral Sudirman No. 28<br />Jakarta Pusat, 10210<br />Indonesia</p>
                </div>
              </li>
              
              <li class="contact-item">
                <div class="contact-icon">✉️</div>
                <div class="contact-content">
                  <h3>Email</h3>
                  <p>Dukungan: <a href="mailto:support@fanb.com">support@fanb.com</a></p>
                  <p>Info: <a href="mailto:info@fanb.com">info@fanb.com</a></p>
                </div>
              </li>
              
              <li class="contact-item">
                <div class="contact-icon">📞</div>
                <div class="contact-content">
                  <h3>Telepon</h3>
                  <p>+62 21 1234 5678 (Jam kerja)</p>
                  <p class="text-muted">Senin - Jumat: 08:00 - 17:00 WIB</p>
                </div>
              </li>
              
              <li class="contact-item">
                <div class="contact-icon">💬</div>
                <div class="contact-content">
                  <h3>Live Chat</h3>
                  <p>Tersedia di aplikasi web kami</p>
                  <p class="text-muted">Senin - Jumat: 08:00 - 20:00 WIB</p>
                </div>
              </li>
            </ul>
            
            <div class="social-links">
              <h3>Ikuti Kami</h3>
              <div class="social-icons">
                <a href="#" class="social-icon">
                  <span>Twitter</span>
                </a>
                <a href="#" class="social-icon">
                  <span>Instagram</span>
                </a>
                <a href="#" class="social-icon">
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          
          <div class="faq-section">
            <h2>Pertanyaan Umum</h2>
            <div class="faq-list">
              <div class="faq-item">
                <h3>Berapa biaya menggunakan FANB?</h3>
                <p>FANB sepenuhnya gratis dengan semua fitur tersedia untuk semua pengguna.</p>
              </div>
              
              <div class="faq-item">
                <h3>Bagaimana cara membatalkan langganan?</h3>
                <p>Anda dapat membatalkan langganan kapan saja dari pengaturan akun Anda. Tidak ada biaya penalti untuk pembatalan, dan Anda dapat terus menggunakan fitur premium hingga akhir periode penagihan Anda.</p>
              </div>
              
              <div class="faq-item">
                <h3>Di mana saya bisa mendapatkan bantuan lebih lanjut?</h3>
                <p>Untuk bantuan yang lebih mendetail, kunjungi <router-link to="/faq">Pusat Bantuan</router-link> kami atau hubungi tim dukungan kami melalui formulir kontak di samping.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="contact-form-container">
          <div class="form-card">
            <h2>Kirim Pesan</h2>
            <p>Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam 24 jam kerja</p>
            
            <form class="contact-form" @submit.prevent="submitForm">
              <div class="form-group">
                <label for="name">Nama Lengkap</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name" 
                  placeholder="Masukkan nama lengkap Anda" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  placeholder="Masukkan alamat email Anda" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="subject">Subjek</label>
                <select id="subject" v-model="form.subject" required>
                  <option value="" disabled selected>Pilih subjek</option>
                  <option value="general">Pertanyaan Umum</option>
                  <option value="support">Dukungan Teknis</option>
                  <option value="billing">Penagihan & Pembayaran</option>
                  <option value="feedback">Umpan Balik & Saran</option>
                  <option value="partnership">Kemitraan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="message">Pesan</label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  rows="6" 
                  placeholder="Tulis pesan Anda di sini..." 
                  required 
                ></textarea>
              </div>
              
              <div class="form-group checkbox-group">
                <input type="checkbox" id="privacy" v-model="form.privacy" required />
                <label for="privacy">
                  Saya telah membaca dan menyetujui <router-link to="/privacy">Kebijakan Privasi</router-link> dan memberikan izin untuk menghubungi saya.
                </label>
              </div>
              
              <button type="submit" class="submit-button" :disabled="isSubmitting">
                <span v-if="isSubmitting">Mengirim...</span>
                <span v-else>Kirim Pesan</span>
              </button>
              
              <div v-if="formStatus.show" :class="['form-status', formStatus.type]">
                {{ formStatus.message }}
              </div>
            </form>
          </div>
          
          <div class="office-hours">
            <h3>Jam Kerja Kantor</h3>
            <div class="hours-grid">
              <div>
                <h4>Senin - Jumat</h4>
                <p>08:00 - 17:00 WIB</p>
              </div>
              <div>
                <h4>Sabtu</h4>
                <p>09:00 - 13:00 WIB</p>
              </div>
              <div>
                <h4>Minggu & Hari Libur</h4>
                <p>Tutup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// Form data
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  privacy: false
});

// Form submission state
const isSubmitting = ref(false);
const formStatus = reactive({
  show: false,
  type: 'success',
  message: ''
});

// Submit form
const submitForm = async () => {
  isSubmitting.value = true;
  
  try {
    // In a real app, you would make an API call here
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    // Show success message
    formStatus.show = true;
    formStatus.type = 'success';
    formStatus.message = 'Pesan Anda telah berhasil dikirim. Kami akan menghubungi Anda segera.';
    
    // Reset form
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';
    form.privacy = false;
    
    // Hide message after 5 seconds
    setTimeout(() => {
      formStatus.show = false;
    }, 5000);
  } catch (error) {
    // Show error message
    formStatus.show = true;
    formStatus.type = 'error';
    formStatus.message = 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi nanti.';
    
    // Hide message after 5 seconds
    setTimeout(() => {
      formStatus.show = false;
    }, 5000);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.static-page {
  padding: 8rem 0 4rem;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 4rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.info-section {
  background: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.info-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.info-section > p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.contact-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

.contact-item {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.contact-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(189, 52, 254, 0.2));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.contact-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contact-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.25rem;
}

.contact-content p:last-child {
  margin-bottom: 0;
}

.text-muted {
  font-size: 0.875rem;
  opacity: 0.7;
}

.contact-content a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-content a:hover {
  color: var(--secondary);
  text-decoration: underline;
}

.social-links h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.faq-section {
  background: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.faq-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.faq-item h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.faq-item p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.faq-item a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.faq-item a:hover {
  color: var(--secondary);
  text-decoration: underline;
}

.contact-form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-card {
  background: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.form-card h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.form-card > p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.contact-form {
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
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: rgba(84, 105, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(84, 105, 255, 0.25);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.checkbox-group {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
}

.checkbox-group input[type="checkbox"] {
  margin-top: 0.25rem;
}

.checkbox-group label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.checkbox-group a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.checkbox-group a:hover {
  color: var(--secondary);
  text-decoration: underline;
}

.submit-button {
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(84, 105, 255, 0.4);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-status {
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
}

.form-status.success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.form-status.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.office-hours {
  background: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.office-hours h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.hours-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.hours-grid div {
  text-align: center;
}

.hours-grid h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.hours-grid p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .hours-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .checkbox-group {
    align-items: flex-start;
  }
  
  .social-icons {
    flex-wrap: wrap;
  }
}
</style> 