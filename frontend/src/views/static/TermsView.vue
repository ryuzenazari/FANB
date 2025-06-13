<template>
  <div class="terms-page static-page-container">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Ketentuan Layanan</h1>
        <p class="page-description">Terakhir diperbarui: 25 Juli 2023</p>
      </div>
      
      <div class="terms-content">
        <section class="terms-section">
          <h2>1. Pendahuluan</h2>
          <p>Selamat datang di FANB. Ketentuan Layanan ini mengatur penggunaan Anda atas platform produktivitas FANB, termasuk aplikasi web dan mobile yang dioperasikan oleh tim FANB.</p>
          <p>Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju dengan bagian apapun dari ketentuan ini, Anda tidak boleh mengakses layanan.</p>
        </section>
        
        <section class="terms-section">
          <h2>2. Akun Pengguna</h2>
          <p>Untuk menggunakan sebagian besar fitur FANB, Anda perlu mendaftar dan membuat akun. Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda dan semua aktivitas yang terjadi di bawah akun Anda.</p>
          <p>Anda setuju untuk memberikan informasi yang akurat, terkini, dan lengkap saat mendaftar dan memperbarui informasi akun Anda. Anda tidak boleh menggunakan identitas palsu atau menyesatkan.</p>
        </section>
        
        <section class="terms-section">
          <h2>3. Penggunaan Layanan</h2>
          <p>FANB memberikan alat produktivitas dan manajemen waktu untuk membantu Anda mengatur pekerjaan dan kehidupan pribadi. Anda setuju untuk menggunakan layanan hanya untuk tujuan yang sah dan sesuai dengan ketentuan ini.</p>
          <p>Anda tidak boleh menggunakan layanan kami untuk:</p>
          <ul>
            <li>Melanggar hukum atau peraturan yang berlaku</li>
            <li>Melanggar hak kekayaan intelektual pihak lain</li>
            <li>Menyebarkan malware atau kode berbahaya lainnya</li>
            <li>Mengganggu atau merusak layanan atau server kami</li>
            <li>Mengumpulkan informasi pengguna tanpa izin</li>
          </ul>
        </section>
        
        <section class="terms-section">
          <h2>4. Konten Pengguna</h2>
          <p>Saat Anda mengunggah, membuat, atau berbagi konten menggunakan FANB, Anda tetap memiliki hak atas konten tersebut. Namun, Anda memberikan kami lisensi untuk menggunakan, menyimpan, dan menampilkan konten Anda untuk tujuan menyediakan layanan.</p>
          <p>Anda bertanggung jawab atas konten yang Anda buat dan jaminan bahwa Anda memiliki hak untuk membagikannya.</p>
        </section>
        
        <section class="terms-section">
          <h2>5. Perubahan dan Penghentian Layanan</h2>
          <p>Kami berhak untuk memodifikasi atau menghentikan layanan, sementara atau permanen, dengan atau tanpa pemberitahuan. Kami tidak bertanggung jawab kepada Anda atau pihak ketiga mana pun atas modifikasi, penangguhan, atau penghentian layanan.</p>
        </section>
        
        <section class="terms-section">
          <h2>6. Batasan Tanggung Jawab</h2>
          <p>Sejauh diizinkan oleh hukum, FANB dan afiliasinya tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, atau punitif, atau kerugian apa pun yang timbul dari penggunaan Anda atas layanan kami.</p>
        </section>
        
        <section class="terms-section">
          <h2>7. Hukum yang Berlaku</h2>
          <p>Ketentuan ini diatur oleh hukum Indonesia. Setiap perselisihan yang timbul dari ketentuan ini akan diselesaikan melalui arbitrase di Jakarta, Indonesia.</p>
        </section>
        
        <section class="terms-section">
          <h2>8. Hubungi Kami</h2>
          <p>Jika Anda memiliki pertanyaan tentang Ketentuan Layanan ini, silakan hubungi kami di: <a href="mailto:legal@fanb.id">legal@fanb.id</a></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Terms page logic
</script>

<style scoped>
.terms-page {
  padding: 6rem 0;
  background-color: var(--background);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-header {
  margin-bottom: 3rem;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.terms-content {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
}

.terms-section {
  margin-bottom: 2.5rem;
}

.terms-section:last-child {
  margin-bottom: 0;
}

.terms-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.terms-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.terms-section ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.terms-section li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.terms-section a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms-section a:hover {
  color: var(--secondary);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .terms-page {
    padding: 4rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .terms-content {
    padding: 1.5rem;
  }
}
</style> 