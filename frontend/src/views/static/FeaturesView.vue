<template>
  <div class="static-page features-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Fitur FANB</h1>
        <p class="page-subtitle">Semua yang Anda butuhkan untuk produktivitas yang lebih baik</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h2>Focus</h2>
          <p>Maksimalkan produktivitas dengan pengaturan waktu fokus dan teknik pomodoro yang disesuaikan dengan kebutuhan Anda</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📋</div>
          <h2>Arrange</h2>
          <p>Manajemen tugas dengan kecerdasan AI yang memprioritaskan pekerjaan penting</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔔</div>
          <h2>Notify</h2>
          <p>Notifikasi pintar yang menghormati waktu fokus Anda</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⚖️</div>
          <h2>Balance</h2>
          <p>Wawasan keseimbangan hidup-kerja yang mencegah kelelahan</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🤖</div>
          <h2>AI Assistant</h2>
          <p>Asisten AI personal yang belajar dari kebiasaan Anda untuk memberikan saran produktivitas yang disesuaikan</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h2>Dashboard</h2>
          <p>Analitik komprehensif untuk melacak kemajuan dan produktivitas Anda dari waktu ke waktu</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Features page
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
  position: relative;
  z-index: 2;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-card h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
}
</style> 