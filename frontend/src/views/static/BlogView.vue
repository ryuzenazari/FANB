<template>
  <div class="static-page blog-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Blog FANB</h1>
        <p class="page-subtitle">Wawasan, tips, dan panduan untuk memaksimalkan produktivitas Anda</p>
      </div>

      <div class="blog-filters">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Cari artikel..." 
            v-model="searchQuery"
            @input="filterArticles"
          />
          <button class="search-button">
            <span class="search-icon">🔍</span>
          </button>
        </div>
        
        <div class="tags-filter">
          <span class="filter-label">Filter:</span>
          <div class="tags-list">
            <button 
              v-for="tag in tags" 
              :key="tag.id"
              :class="['tag-button', { 'active': activeTag === tag.id }]"
              @click="setActiveTag(tag.id)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Featured Article -->
      <div class="featured-article" v-if="featuredArticle && !searchQuery">
        <div class="featured-image">
          <div class="image-placeholder"></div>
          <div class="featured-badge">Terbaru</div>
        </div>
        
        <div class="featured-content">
          <div class="article-meta">
            <span class="article-category">{{ featuredArticle.category }}</span>
            <span class="article-date">{{ featuredArticle.date }}</span>
          </div>
          
          <h2 class="featured-title">{{ featuredArticle.title }}</h2>
          <p class="featured-excerpt">{{ featuredArticle.excerpt }}</p>
          
          <div class="article-footer">
            <div class="author-info">
              <div class="author-avatar">
                <div class="avatar-placeholder">{{ getInitials(featuredArticle.author) }}</div>
              </div>
              <span class="author-name">{{ featuredArticle.author }}</span>
            </div>
            
            <a href="#" class="read-more">Baca Selengkapnya <span class="arrow">→</span></a>
          </div>
        </div>
      </div>

      <!-- Articles Grid -->
      <div v-if="filteredArticles.length > 0">
        <div class="articles-grid">
          <div 
            v-for="(article, index) in filteredArticles" 
            :key="index"
            class="article-card"
          >
            <div class="article-image">
              <div class="image-placeholder"></div>
            </div>
            
            <div class="article-content">
              <div class="article-meta">
                <span class="article-category">{{ article.category }}</span>
                <span class="article-date">{{ article.date }}</span>
              </div>
              
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              
              <div class="article-footer">
                <div class="author-info">
                  <div class="author-avatar">
                    <div class="avatar-placeholder">{{ getInitials(article.author) }}</div>
                  </div>
                  <span class="author-name">{{ article.author }}</span>
                </div>
                
                <a href="#" class="read-more">Baca <span class="arrow">→</span></a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pagination">
          <button class="pagination-button" :disabled="currentPage === 1">
            <span class="arrow">←</span> Sebelumnya
          </button>
          
          <div class="page-numbers">
            <span class="current-page">{{ currentPage }}</span>
            <span>dari</span>
            <span class="total-pages">{{ totalPages }}</span>
          </div>
          
          <button class="pagination-button" :disabled="currentPage === totalPages">
            Berikutnya <span class="arrow">→</span>
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="no-results">
        <div class="no-results-icon">📝</div>
        <h3>Tidak ada artikel yang ditemukan</h3>
        <p>Coba gunakan kata kunci pencarian yang berbeda atau hapus filter yang ada</p>
        <button class="reset-button" @click="resetFilters">Reset Filter</button>
      </div>

      <!-- Newsletter Sign-up -->
      <div class="newsletter-section">
        <div class="newsletter-content">
          <h2>Dapatkan Wawasan Produktivitas Terbaru</h2>
          <p>Berlangganan newsletter mingguan kami untuk mendapatkan tips dan trik terbaru untuk meningkatkan produktivitas dan keseimbangan hidup-kerja Anda.</p>
          
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <div class="form-group">
              <input 
                type="email" 
                placeholder="Email Anda" 
                v-model="newsletterEmail" 
                required 
              />
              <button type="submit" class="subscribe-button">Berlangganan</button>
            </div>
            <div class="form-note">
              <input type="checkbox" id="consent" v-model="newsletterConsent" required />
              <label for="consent">Saya setuju menerima email dari FANB. Anda dapat berhenti berlangganan kapan saja.</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Tags for filtering
const tags = [
  { id: 'all', name: 'Semua' },
  { id: 'productivity', name: 'Produktivitas' },
  { id: 'focus', name: 'Fokus' },
  { id: 'balance', name: 'Keseimbangan' },
  { id: 'workmanagement', name: 'Manajemen Kerja' },
  { id: 'ai', name: 'AI & Otomasi' }
];

const activeTag = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(3);
const newsletterEmail = ref('');
const newsletterConsent = ref(false);

// Mock article data
const articles = [
  {
    title: '7 Teknik Pomodoro yang Dioptimalkan untuk Meningkatkan Fokus',
    excerpt: 'Pelajari cara mengoptimalkan teknik Pomodoro klasik untuk kebutuhan spesifik Anda dan tingkatkan produktivitas secara signifikan.',
    author: 'Budi Santoso',
    date: '12 Mei 2023',
    category: 'Fokus',
    tags: ['productivity', 'focus']
  },
  {
    title: 'Bagaimana AI Dapat Meningkatkan Manajemen Tugas Harian Anda',
    excerpt: 'Asisten AI tidak lagi menjadi teknologi masa depan. Lihat bagaimana AI dapat membantu Anda memprioritaskan tugas dengan lebih efektif.',
    author: 'Lisa Suryana',
    date: '3 Juni 2023',
    category: 'AI & Otomasi',
    tags: ['ai', 'productivity', 'workmanagement']
  },
  {
    title: 'Mencapai Keseimbangan Hidup-Kerja di Era Remote Work',
    excerpt: 'Bekerja dari rumah telah mengaburkan batas antara pekerjaan dan kehidupan pribadi. Temukan strategi untuk membangun batasan yang sehat.',
    author: 'Rina Wijaya',
    date: '28 April 2023',
    category: 'Keseimbangan',
    tags: ['balance', 'productivity']
  },
  {
    title: 'Sistem Manajemen Tugas yang Minimalis untuk Pikiran yang Tenang',
    excerpt: 'Terkadang, sistem manajemen tugas yang lebih sederhana justru lebih efektif. Pelajari pendekatan minimalis untuk mengelola pekerjaan Anda.',
    author: 'Hadi Gunawan',
    date: '15 Mei 2023',
    category: 'Manajemen Kerja',
    tags: ['workmanagement', 'productivity']
  },
  {
    title: 'Deep Work: Cara Mencapai Tingkat Fokus yang Dalam',
    excerpt: 'Konsep "deep work" menjadi semakin penting di era gangguan digital. Temukan cara melatih kemampuan Anda untuk fokus secara mendalam.',
    author: 'Dian Permata',
    date: '9 Juni 2023',
    category: 'Fokus',
    tags: ['focus', 'productivity']
  },
  {
    title: 'Mengotomatiskan Tugas Berulang dengan Integrasi IFTTT dan FANB',
    excerpt: 'Pelajari cara menggunakan IFTTT bersama dengan FANB untuk mengotomatiskan tugas-tugas rutin dan membebaskan waktu Anda untuk pekerjaan kreatif.',
    author: 'Adi Gunawan',
    date: '1 Juni 2023',
    category: 'AI & Otomasi',
    tags: ['ai', 'productivity']
  }
];

// Featured article (the most recent one)
const featuredArticle = computed(() => {
  // Sort by date (in a real app, you'd use proper date sorting)
  return articles[1]; // Just use the second article for this example
});

// Filter articles based on active tag and search query
const filteredArticles = computed(() => {
  let filtered = articles;
  
  // Don't show the featured article in the grid if it's displayed separately
  if (featuredArticle.value && !searchQuery.value) {
    filtered = filtered.filter(article => article.title !== featuredArticle.value.title);
  }
  
  // Filter by tag
  if (activeTag.value !== 'all') {
    filtered = filtered.filter(article => article.tags.includes(activeTag.value));
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.excerpt.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Utility function to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

// Set active tag for filtering
const setActiveTag = (tagId: string) => {
  activeTag.value = tagId;
  currentPage.value = 1; // Reset to first page when changing filter
};

// Filter articles based on search
const filterArticles = () => {
  currentPage.value = 1; // Reset to first page when searching
};

// Reset all filters
const resetFilters = () => {
  searchQuery.value = '';
  activeTag.value = 'all';
  currentPage.value = 1;
};

// Subscribe to newsletter
const subscribeNewsletter = () => {
  // In a real app, you would make an API call here
  alert(`Terima kasih telah berlangganan dengan email: ${newsletterEmail.value}`);
  newsletterEmail.value = '';
  newsletterConsent.value = false;
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

.blog-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-container input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-container input:focus {
  outline: none;
  border-color: rgba(84, 105, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(84, 105, 255, 0.25);
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
}

.tags-filter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.tags-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.tag-button.active {
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(189, 52, 254, 0.2));
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  font-weight: 600;
}

.featured-article {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  background: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.featured-image {
  position: relative;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.3), rgba(189, 52, 254, 0.3));
  position: relative;
}

.featured-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.featured-content {
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.article-category {
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 600;
}

.article-date {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.featured-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.featured-excerpt {
  color: var(--text-secondary);
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.author-name {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.read-more {
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.read-more:hover {
  color: var(--secondary);
}

.arrow {
  transition: transform 0.3s ease;
}

.read-more:hover .arrow {
  transform: translateX(3px);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.article-card {
  background: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.article-image {
  height: 200px;
}

.article-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.article-excerpt {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3rem 0 4rem;
}

.pagination-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.current-page, .total-pages {
  font-weight: 600;
  color: var(--text-primary);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(30, 41, 59, 0.2);
  border-radius: 16px;
  margin-bottom: 4rem;
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.no-results p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.reset-button {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(84, 105, 255, 0.4);
}

.newsletter-section {
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(189, 52, 254, 0.2));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.newsletter-section p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.7;
}

.newsletter-form {
  text-align: left;
}

.form-group {
  display: flex;
  margin-bottom: 1rem;
}

.form-group input {
  flex-grow: 1;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px 0 0 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
}

.subscribe-button {
  background: white;
  color: var(--primary);
  padding: 0 1.5rem;
  border: none;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subscribe-button:hover {
  background: #f0f0f0;
}

.form-note {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.form-note input[type="checkbox"] {
  margin-top: 0.25rem;
}

.form-note label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .featured-article {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .featured-image {
    height: 300px;
  }
  
  .blog-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tags-filter {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    flex-direction: column;
  }
  
  .form-group input {
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .subscribe-button {
    border-radius: 8px;
    padding: 0.75rem 0;
  }
  
  .newsletter-section {
    padding: 2rem 1.5rem;
  }
}
</style> 