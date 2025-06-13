<template>
  <div class="landing-view">
    <!-- Navbar (dihapus karena sekarang menggunakan Navbar.vue) -->
    
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="highlight">FANB</span>
            <span class="tagline">Focus. Arrange. Notify. Balance.</span>
          </h1>
          <p class="hero-subtitle">Asisten manajemen pribadi berbasis AI yang mengoptimalkan produktivitas dan membantu menyeimbangkan pekerjaan dan kehidupan Anda</p>
          
          <div class="cta-buttons">
            <router-link to="/register" class="btn-primary">
              Mulai Sekarang
              <span class="btn-icon">→</span>
            </router-link>
            <a href="#features" class="btn-secondary">
              Pelajari Lebih Lanjut
            </a>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">10k+</span>
              <span class="stat-label">Pengguna</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">4.9</span>
              <span class="stat-label">Rating</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">24/7</span>
              <span class="stat-label">Dukungan</span>
            </div>
          </div>
        </div>
        
        <div class="hero-image">
          <div class="mockup-wrapper">
            <div class="mockup-screen">
              <div class="mockup-content">
                <div class="mockup-header"></div>
                <div class="mockup-body">
                  <div class="mockup-item"></div>
                  <div class="mockup-item"></div>
                  <div class="mockup-item"></div>
                </div>
              </div>
            </div>
            <div class="mockup-reflection"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section Bento Grid -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">Fitur Utama</h2>
        <p class="section-subtitle">Kelola hidup dan pekerjaan Anda dengan lebih efisien</p>
        
        <div class="bento-grid">
          <div class="bento-item feature-focus">
            <div class="feature-icon">🎯</div>
            <h3>Focus</h3>
            <p>Maksimalkan produktivitas dengan pengaturan waktu fokus dan teknik pomodoro yang disesuaikan dengan kebutuhan Anda</p>
          </div>
          
          <div class="bento-item feature-arrange">
            <div class="feature-icon">📋</div>
            <h3>Arrange</h3>
            <p>Manajemen tugas dengan kecerdasan AI yang memprioritaskan pekerjaan penting</p>
          </div>
          
          <div class="bento-item feature-notify">
            <div class="feature-icon">🔔</div>
            <h3>Notify</h3>
            <p>Notifikasi pintar yang menghormati waktu fokus Anda</p>
          </div>
          
          <div class="bento-item feature-balance">
            <div class="feature-icon">⚖️</div>
            <h3>Balance</h3>
            <p>Wawasan keseimbangan hidup-kerja yang mencegah kelelahan</p>
          </div>
          
          <div class="bento-item feature-ai">
            <div class="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Asisten AI personal yang belajar dari kebiasaan Anda untuk memberikan saran produktivitas yang disesuaikan</p>
          </div>
          
          <div class="bento-item feature-dashboard">
            <div class="feature-icon">📊</div>
            <h3>Dashboard</h3>
            <p>Analitik komprehensif untuk melacak kemajuan dan produktivitas Anda dari waktu ke waktu</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="testimonials">
      <div class="container">
        <h2 class="section-title">Apa Kata Pengguna Kami</h2>
        <p class="section-subtitle">Bergabunglah dengan ribuan orang yang produktivitasnya meningkat</p>
        
        <div class="testimonial-container">
          <div class="testimonial-card">
            <div class="quote-mark">"</div>
            <p class="testimonial-text">FANB telah benar-benar mengubah cara saya mengelola pekerjaan dan kehidupan pribadi. Asisten AI-nya sangat membantu.</p>
            <div class="testimonial-author">
              <img src="https://ui-avatars.com/api/?name=Sarah+L&background=0D8ABC&color=fff" alt="Sarah L." class="author-avatar" />
              <div>
                <h4 class="author-name">Ryan Besto Saragih</h4>
                <p class="author-title">Product Manager</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="quote-mark">"</div>
            <p class="testimonial-text">Saya sudah mencoba banyak aplikasi produktivitas, tapi fokus FANB pada keseimbangan kerja-hidup membuatnya menonjol.</p>
            <div class="testimonial-author">
              <img src="https://ui-avatars.com/api/?name=Michael+T&background=8B5CF6&color=fff" alt="Michael T." class="author-avatar" />
              <div>
                <h4 class="author-name">Michael Haq</h4>
                <p class="author-title">Freelance Designer</p>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="quote-mark">"</div>
            <p class="testimonial-text">Pengelolaan notifikasi di FANB sangat luar biasa. Saya tidak lagi terus-menerus terganggu oleh pemberitahuan.</p>
            <div class="testimonial-author">
              <img src="https://ui-avatars.com/api/?name=Ani+P&background=10B981&color=fff" alt="Ani P." class="author-avatar" />
              <div>
                <h4 class="author-name">Abriel P. Chaniago</h4>
                <p class="author-title">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Siap untuk mengoptimalkan produktivitas Anda?</h2>
          <p>Bergabunglah dengan ribuan profesional yang sudah menggunakan FANB.</p>
          <router-link to="/register" class="btn-cta">
            Mulai Uji Coba Gratis
            <span class="btn-icon">→</span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Landing page logic
</script>

<style scoped>
:root {
  --primary: #5469FF;
  --primary-dark: #3E51DB;
  --secondary: #BD34FE;
  --accent: #FF6B6B;
  --text-primary: #F9FAFB;
  --text-secondary: #CED3DB;
  --surface-1: rgba(30, 41, 59, 0.4);
  --surface-2: rgba(30, 41, 59, 0.7);
}

/* Base Styles */
.landing-view {
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

/* Background Elements - Dihapus karena menggunakan Background dari App.vue */

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 7rem 0 5rem;
  overflow: hidden;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.highlight {
  display: block;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
}

.tagline {
  display: block;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--text-primary);
  opacity: 0.9;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(84, 105, 255, 0.4);
}

.btn-primary:hover::before {
  opacity: 1;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-icon,
.btn-secondary:hover .btn-icon {
  transform: translateX(4px);
}

.hero-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.mockup-wrapper {
  position: relative;
  transform-style: preserve-3d;
  animation: floatDevice 6s ease-in-out infinite;
}

@keyframes floatDevice {
  0%, 100% { transform: translateY(0) rotateY(0); }
  50% { transform: translateY(-20px) rotateY(5deg); }
}

.mockup-screen {
  width: 350px;
  height: 600px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: rotate3d(0.5, -0.866, 0, 15deg) rotate(1deg);
}

.mockup-content {
  height: 100%;
  padding: 1.5rem;
}

.mockup-header {
  height: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.mockup-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mockup-item {
  height: 4rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  animation: pulse 3s infinite alternate;
}

.mockup-item:nth-child(2) {
  animation-delay: 0.5s;
}

.mockup-item:nth-child(3) {
  animation-delay: 1s;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  100% { opacity: 0.8; }
}

.mockup-reflection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 50%
  );
  border-radius: 30px;
  pointer-events: none;
}

/* Features Section */
.features {
  padding: 8rem 0;
  position: relative;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.section-subtitle {
  font-size: 1.25rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  color: var(--text-secondary);
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 1.5rem;
}

.bento-item {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
  overflow: hidden;
  position: relative;
}

.bento-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}

.bento-item:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.3);
}

.bento-item:hover::before {
  transform: translateX(0);
}

.feature-focus {
  grid-column: span 6;
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(30, 41, 59, 0.4));
}

.feature-arrange {
  grid-column: span 6;
  background: linear-gradient(135deg, rgba(189, 52, 254, 0.2), rgba(30, 41, 59, 0.4));
}

.feature-notify {
  grid-column: span 4;
}

.feature-balance {
  grid-column: span 4;
}

.feature-ai {
  grid-column: span 4;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(30, 41, 59, 0.4));
}

.feature-dashboard {
  grid-column: span 12;
  grid-row: span 1;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.bento-item h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.bento-item p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Testimonials */
.testimonials {
  padding: 8rem 0;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.testimonial-container {
  display: flex;
  gap: 2rem;
  margin-top: 4rem;
  padding-bottom: 2rem;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.testimonial-container::-webkit-scrollbar {
  display: none;
}

.testimonial-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  min-width: 350px;
  flex: 1;
  position: relative;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.3);
}

.quote-mark {
  font-size: 5rem;
  line-height: 0;
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  color: rgba(255, 255, 255, 0.1);
  font-family: serif;
}

.testimonial-text {
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  position: relative;
  color: var(--text-secondary);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  font-size: 1.125rem;
  margin: 0;
}

.author-title {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

/* CTA Section */
.cta-section {
  padding: 8rem 0;
  position: relative;
  overflow: hidden;
}

.cta-content {
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(189, 52, 254, 0.2));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 4rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  color: var(--text-secondary);
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(84, 105, 255, 0.4);
}

.btn-cta:hover .btn-icon {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero .container {
    grid-template-columns: 1fr;
    gap: 4rem;
    padding-top: 2rem;
  }
  
  .hero-content {
    max-width: 100%;
    text-align: center;
    margin: 0 auto;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .cta-buttons {
    justify-content: center;
  }
  
  .bento-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .feature-focus, 
  .feature-arrange,
  .feature-notify,
  .feature-balance,
  .feature-ai {
    grid-column: span 6;
  }
  
  .feature-dashboard {
    grid-column: span 6;
  }
  
  .hero {
    padding: 6rem 0 4rem;
    min-height: auto;
  }
  
  .mockup-screen {
    width: 300px;
    height: 550px;
  }
  
  .hero-image {
    margin-top: 2rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }
  
  .hero {
    padding: 4rem 0 2rem;
    min-height: auto;
  }
  
  .hero-title {
    font-size: clamp(2rem, 5vw, 3rem);
  }
  
  .tagline {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
  }
  
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto 2rem;
    gap: 1rem;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .bento-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .feature-focus, 
  .feature-arrange,
  .feature-notify,
  .feature-balance,
  .feature-ai,
  .feature-dashboard {
    grid-column: span 1;
  }
  
  .testimonial-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .testimonial-card {
    min-width: unset;
  }
  
  .cta-content {
    padding: 3rem 1.5rem;
  }
  
  .cta-content h2 {
    font-size: 2rem;
  }
  
  .cta-content p {
    font-size: 1rem;
  }
  
  .btn-cta {
    width: 100%;
    justify-content: center;
  }
  
  .features, .testimonials, .cta-section {
    padding: 3rem 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
    margin-bottom: 2.5rem;
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 3.5rem 0 2rem;
  }
  
  .hero-title {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
  }
  
  .tagline {
    font-size: clamp(1.1rem, 3vw, 1.5rem);
  }
  
  .mockup-screen {
    width: 250px;
    height: 450px;
    transform: rotate3d(0.5, -0.866, 0, 10deg) rotate(1deg);
  }
  
  .hero-stats {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
  
  .stat-item {
    flex: 1;
    min-width: 80px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .feature-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .bento-item {
    padding: 1.5rem;
  }
  
  .bento-item h3 {
    font-size: 1.25rem;
  }
  
  .testimonial-card {
    padding: 1.75rem;
  }
  
  .quote-mark {
    font-size: 3.5rem;
    top: 1rem;
    left: 1rem;
  }
  
  .cta-content {
    padding: 2rem 1rem;
    border-radius: 16px;
  }
  
  .btn-cta {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
  
  .container {
    padding: 0 1rem;
  }
}

/* Perbaikan untuk perangkat touchscreen */
@media (hover: none) and (pointer: coarse) {
  .btn-primary:active,
  .btn-secondary:active,
  .btn-cta:active {
    transform: scale(0.98);
  }
}

/* Penyesuaian untuk layar dengan tinggi kecil */
@media (max-height: 700px) {
  .hero {
    min-height: auto;
    padding: 6rem 0 3rem;
  }
  
  .hero-title {
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    margin-bottom: 1.5rem;
  }
  
  .cta-buttons {
    margin-bottom: 1.5rem;
  }
  
  .hero-stats {
    margin-bottom: 1rem;
  }
  
  .features, .testimonials, .cta-section {
    padding: 4rem 0;
  }
}

/* Perbaikan untuk viewport heights pada mobile */
@media (max-width: 768px) and (max-height: 800px) {
  .hero {
    padding: 3rem 0 2rem;
  }
  
  .mockup-screen {
    height: 400px;
    width: auto;
    aspect-ratio: 9/16;
  }
}
</style> 