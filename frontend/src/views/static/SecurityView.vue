<template>
  <div class="static-page security-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Keamanan FANB</h1>
        <p class="page-subtitle">Bagaimana kami melindungi data dan privasi Anda</p>
      </div>

      <div class="security-content">
        <div class="security-section">
          <h2>Keamanan Data</h2>
          <p>Di FANB, keamanan data Anda adalah prioritas kami. Kami menggunakan enkripsi end-to-end untuk memastikan informasi Anda tetap aman dan terlindungi dari akses yang tidak sah.</p>
          <ul class="security-list">
            <li>Enkripsi AES-256 untuk semua data yang disimpan</li>
            <li>Enkripsi TLS 1.3 untuk transfer data</li>
            <li>Otentikasi multi-faktor untuk melindungi akun Anda</li>
            <li>Pemantauan keamanan 24/7 untuk mendeteksi aktivitas mencurigakan</li>
          </ul>
        </div>

        <div class="security-section">
          <h2>Privasi Pengguna</h2>
          <p>Kami menghormati privasi Anda dan tidak pernah menjual data pribadi Anda kepada pihak ketiga. Kebijakan privasi kami dirancang untuk menjadi transparan tentang bagaimana data Anda digunakan.</p>
          <ul class="security-list">
            <li>Tidak ada pelacakan aktivitas pengguna untuk tujuan iklan</li>
            <li>Kontrol privasi yang dapat disesuaikan</li>
            <li>Transparansi tentang data apa yang kami kumpulkan</li>
            <li>Hak untuk mengunduh atau menghapus data Anda kapan saja</li>
          </ul>
        </div>

        <div class="security-section">
          <h2>Infrastruktur Kami</h2>
          <p>Platform FANB dibangun di atas infrastruktur keamanan kelas dunia dengan berbagai lapisan perlindungan untuk menjaga keamanan data Anda.</p>
          <ul class="security-list">
            <li>Server di pusat data bersertifikat ISO 27001</li>
            <li>Pembaruan keamanan otomatis dan patch reguler</li>
            <li>Firewall aplikasi web untuk melindungi dari serangan</li>
            <li>Backup data terenkripsi dengan redundansi geografis</li>
          </ul>
        </div>

        <div class="security-card">
          <div class="card-icon">🔒</div>
          <h3>Keamanan Adalah Komitmen Kami</h3>
          <p>Kami terus memperbaharui praktik keamanan kami untuk memastikan bahwa data Anda selalu terlindungi dengan teknologi terkini.</p>
          <a href="#" class="security-link">Pelajari lebih lanjut tentang praktik keamanan kami</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Security page
</script>

<style scoped>
.static-page {
  padding: 8rem 0 4rem;
  min-height: 100vh;
}

.container {
  max-width: 1000px;
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

.security-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.security-section {
  background: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.security-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-weight: 700;
}

.security-section p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.security-list {
  list-style: none;
  padding: 0;
}

.security-list li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
}

.security-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: bold;
}

.security-card {
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(189, 52, 254, 0.2));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
}

.card-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.security-card h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.security-card p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.security-link {
  display: inline-block;
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.security-link:hover {
  color: var(--secondary);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .security-section {
    padding: 1.5rem;
  }
}
</style> 