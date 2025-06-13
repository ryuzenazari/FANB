<template>
  <div class="static-page faq-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Pertanyaan Umum</h1>
        <p class="page-subtitle">Jawaban untuk pertanyaan yang sering ditanyakan tentang FANB</p>
      </div>

      <div class="search-container">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari pertanyaan..."
            @input="filterQuestions"
          />
          <button class="search-button">
            <span class="search-icon">🔍</span>
          </button>
        </div>
      </div>

      <div class="faq-container">
        <div class="faq-categories">
          <h2>Kategori</h2>
          <ul class="category-list">
            <li 
              v-for="category in categories" 
              :key="category.id"
              :class="{ 'active': activeCategory === category.id }"
              @click="setCategory(category.id)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span>{{ category.name }}</span>
            </li>
          </ul>
        </div>

        <div class="faq-content">
          <div class="no-results" v-if="filteredQuestions.length === 0">
            <div class="no-results-icon">🔎</div>
            <h3>Tidak ada hasil yang ditemukan</h3>
            <p>Coba gunakan kata kunci yang berbeda atau hubungi kami untuk bantuan</p>
          </div>
          
          <div v-else>
            <div 
              v-for="(question, index) in filteredQuestions" 
              :key="index" 
              class="faq-item"
              :class="{ 'active': activeQuestion === index }"
            >
              <div class="question" @click="toggleQuestion(index)">
                <h3>{{ question.title }}</h3>
                <span class="toggle-icon">{{ activeQuestion === index ? '−' : '+' }}</span>
              </div>
              <div class="answer" v-if="activeQuestion === index">
                <p v-html="question.answer"></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="support-section">
        <h2>Masih membutuhkan bantuan?</h2>
        <p>Jika Anda tidak menemukan jawaban untuk pertanyaan Anda, hubungi tim dukungan kami</p>
        <div class="support-options">
          <a href="#" class="support-option">
            <span class="option-icon">✉️</span>
            <div>
              <h3>Email</h3>
              <p>support@fanb.com</p>
            </div>
          </a>
          <a href="#" class="support-option">
            <span class="option-icon">💬</span>
            <div>
              <h3>Live Chat</h3>
              <p>Senin-Jumat, 08:00-20:00</p>
            </div>
          </a>
          <a href="#" class="support-option">
            <span class="option-icon">📞</span>
            <div>
              <h3>Telepon</h3>
              <p>+62 21 1234 5678</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const searchQuery = ref('');
const activeCategory = ref('all');
const activeQuestion = ref(-1);

// Kategori FAQ
const categories = [
  { id: 'all', name: 'Semua', icon: '🔍' },
  { id: 'general', name: 'Umum', icon: 'ℹ️' },
  { id: 'account', name: 'Akun', icon: '👤' },
  { id: 'features', name: 'Fitur', icon: '⚙️' },
  { id: 'billing', name: 'Pembayaran', icon: '💳' },
  { id: 'technical', name: 'Teknis', icon: '🔧' }
];

// Data FAQ
const questions = [
  {
    title: 'Apa itu FANB?',
    answer: 'FANB adalah platform produktivitas berbasis AI yang membantu Anda fokus, mengatur tugas, menerima notifikasi yang cerdas, dan menyeimbangkan kehidupan dengan pekerjaan Anda. Nama FANB merupakan singkatan dari <strong>Focus, Arrange, Notify, Balance</strong>.',
    category: 'general'
  },
  {
    title: 'Bagaimana cara membuat akun FANB?',
    answer: 'Untuk membuat akun FANB, klik tombol "Daftar" di halaman utama. Anda dapat mendaftar menggunakan email, akun Google, atau akun Apple Anda. Setelah mendaftar, Anda akan diminta untuk mengisi beberapa informasi profil dasar untuk membantu kami menyesuaikan pengalaman Anda.',
    category: 'account'
  },
  {
    title: 'Apakah FANB tersedia di perangkat mobile?',
    answer: 'Ya, FANB tersedia di web, iOS, dan Android. Semua data Anda akan disinkronkan secara otomatis di semua perangkat, sehingga Anda dapat melanjutkan pekerjaan Anda dari mana saja.',
    category: 'technical'
  },
  {
    title: 'Apa perbedaan antara paket Free dan Pro?',
    answer: 'FANB menyediakan semua fitur secara gratis, termasuk manajemen tugas, timer pomodoro, asisten AI, proyek tidak terbatas, integrasi dengan kalender, dan banyak lagi.',
    category: 'billing'
  },
  {
    title: 'Bagaimana cara kerja fitur Pomodoro di FANB?',
    answer: 'Teknik Pomodoro adalah metode manajemen waktu yang membagi pekerjaan menjadi interval fokus (biasanya 25 menit) yang diselingi dengan istirahat singkat. FANB memungkinkan Anda menyesuaikan interval fokus dan istirahat, melacak sesi Anda, dan mengintegrasikannya dengan daftar tugas Anda.',
    category: 'features'
  },
  {
    title: 'Bagaimana cara membatalkan langganan saya?',
    answer: 'Anda dapat membatalkan langganan kapan saja dari pengaturan akun Anda. Setelah dibatalkan, Anda masih dapat menggunakan fitur premium hingga akhir periode penagihan Anda, kemudian akun Anda akan otomatis beralih ke paket Free.',
    category: 'billing'
  },
  {
    title: 'Apa itu Asisten AI FANB?',
    answer: 'Asisten AI FANB adalah fitur cerdas yang menganalisis kebiasaan produktivitas Anda untuk memberikan rekomendasi yang dipersonalisasi. Asisten ini dapat membantu Anda memprioritaskan tugas, menyarankan waktu fokus optimal, dan memberikan wawasan tentang pola produktivitas Anda.',
    category: 'features'
  },
  {
    title: 'Apakah FANB mendukung kolaborasi tim?',
    answer: 'Ya, paket Enterprise FANB mendukung kolaborasi tim dengan fitur seperti penugasan tugas, ruang kerja bersama, dan dasbor tim. Ini memungkinkan tim untuk bekerja bersama secara efisien sambil tetap mengelola tugas pribadi mereka.',
    category: 'features'
  },
  {
    title: 'Apakah data saya aman dengan FANB?',
    answer: 'Ya, keamanan data adalah prioritas utama kami. FANB menggunakan enkripsi end-to-end, otentikasi multi-faktor, dan praktik keamanan terbaik untuk melindungi data Anda. Kami tidak pernah menjual data pribadi pengguna kepada pihak ketiga. Pelajari lebih lanjut di halaman <a href="/security">Keamanan</a> kami.',
    category: 'technical'
  },
  {
    title: 'Bagaimana cara reset password?',
    answer: 'Untuk mereset password, klik "Lupa password?" di halaman masuk. Masukkan alamat email terdaftar Anda, dan kami akan mengirimkan tautan reset password. Klik tautan tersebut untuk membuat password baru.',
    category: 'account'
  }
];

// Filter pertanyaan berdasarkan kategori dan pencarian
const filteredQuestions = computed(() => {
  let filtered = questions;
  
  // Filter berdasarkan kategori
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(q => q.category === activeCategory.value);
  }
  
  // Filter berdasarkan pencarian
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(q => 
      q.title.toLowerCase().includes(query) || 
      q.answer.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Fungsi untuk mengubah kategori aktif
const setCategory = (categoryId: string) => {
  activeCategory.value = categoryId;
  activeQuestion.value = -1; // Reset pertanyaan aktif
};

// Fungsi untuk menangani pencarian
const filterQuestions = () => {
  activeQuestion.value = -1; // Reset pertanyaan aktif
};

// Fungsi untuk toggle pertanyaan
const toggleQuestion = (index: number) => {
  activeQuestion.value = activeQuestion.value === index ? -1 : index;
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
  margin-bottom: 3rem;
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

.search-container {
  max-width: 600px;
  margin: 0 auto 4rem;
}

.search-box {
  display: flex;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 1rem 1rem 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: rgba(84, 105, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(84, 105, 255, 0.25);
}

.search-box input::placeholder {
  color: var(--text-secondary);
}

.search-button {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.25rem;
}

.faq-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 3rem;
  margin-bottom: 5rem;
}

.faq-categories h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.category-list {
  list-style: none;
  padding: 0;
}

.category-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.category-list li:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.category-list li.active {
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(189, 52, 254, 0.2));
  color: var(--text-primary);
  font-weight: 600;
}

.category-icon {
  font-size: 1.25rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background: rgba(30, 41, 59, 0.2);
  border-radius: 16px;
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.no-results p {
  color: var(--text-secondary);
}

.faq-item {
  background: rgba(30, 41, 59, 0.2);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.faq-item.active {
  background: rgba(30, 41, 59, 0.4);
}

.question {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.question h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.toggle-icon {
  font-size: 1.5rem;
  color: var(--primary);
}

.answer {
  padding: 0 1.5rem 1.5rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.answer p {
  margin: 0;
}

.answer a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.answer a:hover {
  color: var(--secondary);
  text-decoration: underline;
}

.support-section {
  text-align: center;
  padding: 3rem;
  background: rgba(30, 41, 59, 0.2);
  border-radius: 16px;
}

.support-section h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.support-section p {
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.125rem;
}

.support-options {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.support-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-align: left;
  transition: all 0.3s ease;
  text-decoration: none;
  color: var(--text-primary);
  flex-basis: 250px;
}

.support-option:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
}

.option-icon {
  font-size: 2rem;
}

.support-option h3 {
  font-size: 1.25rem;
  margin: 0 0 0.25rem;
}

.support-option p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .faq-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .faq-categories {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .category-list li {
    margin-bottom: 0;
    flex-grow: 1;
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .support-options {
    flex-direction: column;
    align-items: center;
  }
  
  .support-option {
    width: 100%;
  }
}
</style> 