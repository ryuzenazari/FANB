<template>
  <div class="privacy-page static-page-container">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Kebijakan Privasi</h1>
        <p class="page-description">Terakhir diperbarui: 25 Juli 2023</p>
      </div>
      
      <div class="privacy-content">
        <section class="privacy-section">
          <h2>1. Pendahuluan</h2>
          <p>FANB ("kami", "kita", atau "FANB") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan membagikan informasi pribadi Anda saat Anda menggunakan platform FANB.</p>
          <p>Dengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini.</p>
        </section>
        
        <section class="privacy-section">
          <h2>2. Informasi yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan beberapa jenis informasi dari pengguna kami:</p>
          <ul>
            <li><strong>Informasi Akun</strong>: Saat Anda mendaftar, kami mengumpulkan nama, alamat email, dan kata sandi Anda.</li>
            <li><strong>Informasi Profil</strong>: Anda dapat memilih untuk memberikan informasi tambahan seperti nama lengkap, foto profil, dan preferensi personal.</li>
            <li><strong>Data Penggunaan</strong>: Kami mengumpulkan informasi tentang bagaimana Anda menggunakan platform kami, termasuk tugas yang Anda buat, waktu yang Anda habiskan, dan fitur yang Anda gunakan.</li>
            <li><strong>Informasi Perangkat</strong>: Kami mengumpulkan informasi tentang perangkat yang Anda gunakan, seperti jenis perangkat, sistem operasi, dan alamat IP.</li>
            <li><strong>Cookies dan Teknologi Serupa</strong>: Kami menggunakan cookies dan teknologi pelacakan serupa untuk meningkatkan pengalaman pengguna.</li>
          </ul>
        </section>
        
        <section class="privacy-section">
          <h2>3. Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
          <ul>
            <li>Menyediakan, memelihara, dan meningkatkan platform FANB</li>
            <li>Memproses transaksi dan mengelola akun pengguna</li>
            <li>Mengirim pemberitahuan dan pembaruan terkait layanan</li>
            <li>Memahami bagaimana pengguna menggunakan layanan kami untuk meningkatkannya</li>
            <li>Mendeteksi, mencegah, dan mengatasi masalah keamanan dan aktivitas yang berpotensi ilegal</li>
            <li>Menyediakan layanan pelanggan yang responsif</li>
          </ul>
        </section>
        
        <section class="privacy-section">
          <h2>4. Berbagi Informasi</h2>
          <p>Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Namun, kami dapat membagikan informasi dalam situasi berikut:</p>
          <ul>
            <li><strong>Dengan Penyedia Layanan</strong>: Kami bekerja dengan perusahaan pihak ketiga yang membantu kami mengoperasikan dan meningkatkan platform kami.</li>
            <li><strong>Untuk Kepatuhan Hukum</strong>: Kami dapat membagikan informasi jika diwajibkan oleh hukum atau untuk melindungi hak, properti, atau keamanan kami.</li>
            <li><strong>Dengan Persetujuan Anda</strong>: Kami akan membagikan informasi dengan cara lain jika Anda telah menyetujuinya.</li>
          </ul>
        </section>
        
        <section class="privacy-section">
          <h2>5. Keamanan Data</h2>
          <p>Kami mengambil langkah-langkah keamanan untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi internet atau penyimpanan elektronik yang 100% aman.</p>
        </section>
        
        <section class="privacy-section">
          <h2>6. Hak Privasi Anda</h2>
          <p>Tergantung pada lokasi Anda, Anda mungkin memiliki hak tertentu terkait dengan data pribadi Anda, termasuk:</p>
          <ul>
            <li>Hak untuk mengakses data yang kami simpan tentang Anda</li>
            <li>Hak untuk memperbaiki atau memperbarui data Anda</li>
            <li>Hak untuk menghapus data Anda</li>
            <li>Hak untuk membatasi atau menolak pengolahan data Anda</li>
            <li>Hak untuk portabilitas data</li>
          </ul>
          <p>Untuk menggunakan hak ini, silakan hubungi kami melalui informasi kontak di bawah.</p>
        </section>
        
        <section class="privacy-section">
          <h2>7. Perubahan pada Kebijakan Privasi</h2>
          <p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan signifikan dengan memposting kebijakan baru di platform kami.</p>
        </section>
        
        <section class="privacy-section">
          <h2>8. Hubungi Kami</h2>
          <p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di: <a href="mailto:privacy@fanb.id">privacy@fanb.id</a></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Privacy page logic
</script>

<style scoped>
.privacy-page {
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

.privacy-content {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
}

.privacy-section {
  margin-bottom: 2.5rem;
}

.privacy-section:last-child {
  margin-bottom: 0;
}

.privacy-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.privacy-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.privacy-section ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.privacy-section li {
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.privacy-section strong {
  color: var(--text-primary);
  font-weight: 600;
}

.privacy-section a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.privacy-section a:hover {
  color: var(--secondary);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .privacy-page {
    padding: 4rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .privacy-content {
    padding: 1.5rem;
  }
}
</style> 