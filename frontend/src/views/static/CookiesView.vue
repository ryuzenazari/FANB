<template>
  <div class="cookies-page static-page-container">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Kebijakan Cookies</h1>
        <p class="page-description">Terakhir diperbarui: 25 Juli 2023</p>
      </div>
      
      <div class="cookies-content">
        <section class="cookies-section">
          <h2>1. Pendahuluan</h2>
          <p>Website FANB menggunakan cookies dan teknologi pelacakan serupa untuk meningkatkan pengalaman pengguna dan menganalisis penggunaan platform kami. Kebijakan Cookies ini menjelaskan apa itu cookies, bagaimana kami menggunakannya, dan pilihan Anda terkait cookies.</p>
        </section>
        
        <section class="cookies-section">
          <h2>2. Apa itu Cookies?</h2>
          <p>Cookies adalah file kecil yang disimpan di perangkat Anda ketika Anda mengunjungi sebuah website. Cookies memungkinkan website untuk "mengingat" tindakan atau preferensi Anda dari waktu ke waktu.</p>
          <p>Selain cookies, kami juga dapat menggunakan teknologi serupa seperti pixel tags, web beacons, dan local storage untuk tujuan yang sama.</p>
        </section>
        
        <section class="cookies-section">
          <h2>3. Jenis Cookies yang Kami Gunakan</h2>
          <p>Kami menggunakan beberapa jenis cookies di website kami:</p>
          <ul>
            <li><strong>Cookies yang Sangat Diperlukan</strong>: Cookies ini diperlukan agar website dapat berfungsi dan tidak dapat dimatikan dalam sistem kami. Biasanya cookies ini hanya diatur sebagai respons terhadap tindakan yang Anda lakukan yang merupakan permintaan layanan, seperti mengatur preferensi privasi Anda, masuk, atau mengisi formulir.</li>
            <li><strong>Cookies Fungsionalitas</strong>: Cookies ini memungkinkan website kami menyediakan fungsionalitas dan personalisasi yang ditingkatkan. Cookies ini dapat diatur oleh kami atau oleh penyedia pihak ketiga yang jasanya telah kami tambahkan ke halaman kami.</li>
            <li><strong>Cookies Analitik</strong>: Cookies ini memungkinkan kami menghitung kunjungan dan sumber lalu lintas sehingga kami dapat mengukur dan meningkatkan kinerja website kami. Cookies ini membantu kami mengetahui halaman mana yang paling dan paling tidak populer dan melihat bagaimana pengunjung bergerak di sekitar website.</li>
            <li><strong>Cookies Periklanan</strong>: Cookies ini dapat diatur melalui website kami oleh mitra periklanan kami. Cookies ini dapat digunakan oleh perusahaan-perusahaan tersebut untuk membangun profil minat Anda dan menampilkan iklan yang relevan di website lain.</li>
          </ul>
        </section>
        
        <section class="cookies-section">
          <h2>4. Tujuan Penggunaan Cookies</h2>
          <p>Kami menggunakan cookies untuk berbagai tujuan, termasuk:</p>
          <ul>
            <li>Mengautentikasi pengguna dan mempertahankan sesi pengguna</li>
            <li>Mengingat preferensi dan pengaturan pengguna</li>
            <li>Menganalisis penggunaan dan kinerja website</li>
            <li>Meningkatkan keamanan website</li>
            <li>Menyediakan konten yang dipersonalisasi</li>
            <li>Mengukur efektivitas pemasaran kami</li>
          </ul>
        </section>
        
        <section class="cookies-section">
          <h2>5. Mengelola Cookies</h2>
          <p>Sebagian besar browser web memungkinkan Anda mengontrol cookies melalui pengaturan preferensi mereka. Anda dapat:</p>
          <ul>
            <li>Melihat cookies yang telah disimpan dan menghapusnya secara individual</li>
            <li>Memblokir cookies pihak ketiga</li>
            <li>Memblokir cookies dari situs tertentu</li>
            <li>Memblokir semua cookies</li>
            <li>Menghapus semua cookies saat Anda menutup browser</li>
          </ul>
          <p>Harap diperhatikan bahwa jika Anda memilih untuk memblokir cookies, Anda mungkin tidak dapat mengakses semua atau sebagian dari website kami atau beberapa fitur mungkin tidak berfungsi dengan baik.</p>
        </section>
        
        <section class="cookies-section">
          <h2>6. Cookies Pihak Ketiga</h2>
          <p>Beberapa cookies yang kami gunakan diatur oleh pihak ketiga yang menyediakan layanan tertentu kepada kami, seperti analitik dan periklanan. Pihak ketiga ini dapat menggunakan cookies, web beacons, dan teknologi serupa untuk mengumpulkan atau menerima informasi dari website kami dan di tempat lain di internet.</p>
        </section>
        
        <section class="cookies-section">
          <h2>7. Perubahan pada Kebijakan Cookies</h2>
          <p>Kami dapat memperbarui Kebijakan Cookies ini dari waktu ke waktu untuk mencerminkan perubahan pada cookies yang kami gunakan atau untuk alasan operasional, hukum, atau peraturan lainnya.</p>
        </section>
        
        <section class="cookies-section">
          <h2>8. Hubungi Kami</h2>
          <p>Jika Anda memiliki pertanyaan tentang Kebijakan Cookies ini, silakan hubungi kami di: <a href="mailto:privacy@fanb.id">privacy@fanb.id</a></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Cookies page logic
</script>

<style scoped>
.cookies-page {
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

.cookies-content {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
}

.cookies-section {
  margin-bottom: 2.5rem;
}

.cookies-section:last-child {
  margin-bottom: 0;
}

.cookies-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.cookies-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.cookies-section ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.cookies-section li {
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.cookies-section strong {
  color: var(--text-primary);
  font-weight: 600;
}

.cookies-section a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.cookies-section a:hover {
  color: var(--secondary);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .cookies-page {
    padding: 4rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .cookies-content {
    padding: 1.5rem;
  }
}
</style> 