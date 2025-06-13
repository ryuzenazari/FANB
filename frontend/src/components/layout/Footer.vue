<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-logo">FANB</div>
          <p>Platform produktivitas modern untuk individu dan tim.</p>
          <div class="social-links">
            <a href="https://twitter.com" target="_blank" class="social-link">Twitter</a>
            <a href="https://instagram.com" target="_blank" class="social-link">Instagram</a>
            <a href="https://linkedin.com" target="_blank" class="social-link">LinkedIn</a>
          </div>
        </div>
        
        <div class="footer-links">
          <div class="footer-column">
            <h4>Platform</h4>
            <ul>
              <li><router-link to="/features" class="footer-link" @click="scrollToTop">Fitur</router-link></li>
              <li><router-link to="/security" class="footer-link" @click="scrollToTop">Keamanan</router-link></li>
              <li><router-link to="/faq" class="footer-link" @click="scrollToTop">FAQ</router-link></li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h4>Perusahaan</h4>
            <ul>
              <li><router-link to="/about" class="footer-link" @click="scrollToTop">Tentang Kami</router-link></li>
              <li><router-link to="/careers" class="footer-link" @click="scrollToTop">Karier</router-link></li>
              <li><router-link to="/blog" class="footer-link" @click="scrollToTop">Blog</router-link></li>
              <li><router-link to="/contact" class="footer-link" @click="scrollToTop">Kontak</router-link></li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><router-link to="/terms" class="footer-link" @click="scrollToTop">Ketentuan</router-link></li>
              <li><router-link to="/privacy" class="footer-link" @click="scrollToTop">Privasi</router-link></li>
              <li><router-link to="/cookies" class="footer-link" @click="scrollToTop">Cookies</router-link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 FANB. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
</script>

<style scoped>
.footer {
  padding: 6rem 0 2rem;
  background: rgba(17, 24, 39, 0.95); /* Meningkatkan opacity background */
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Meningkatkan opacity border */
  position: relative;
  z-index: 10;
  color: var(--text-primary); /* Memastikan teks selalu terlihat */
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
}

.footer-brand p {
  color: var(--text-primary); /* Meningkatkan kontras teks */
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.social-link {
  color: var(--text-primary); /* Meningkatkan kontras teks */
  text-decoration: none;
  transition: color 0.3s ease;
  opacity: 0.9; /* Memastikan link selalu terlihat */
}

.social-link:hover {
  color: var(--primary);
  opacity: 1;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-column h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary); /* Memastikan heading selalu terlihat */
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 0.75rem;
}

.footer-column a,
.footer-link {
  color: var(--text-primary); /* Meningkatkan kontras teks */
  text-decoration: none;
  transition: color 0.3s ease;
  opacity: 0.9; /* Memastikan link selalu terlihat */
}

.footer-column a:hover,
.footer-link:hover {
  color: var(--primary);
  opacity: 1;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Meningkatkan opacity border */
  text-align: center;
  color: var(--text-primary); /* Meningkatkan kontras teks */
  font-size: 0.875rem;
  opacity: 0.9; /* Memastikan teks selalu terlihat */
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .footer-links {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-links {
    grid-template-columns: 1fr;
  }
}
</style> 