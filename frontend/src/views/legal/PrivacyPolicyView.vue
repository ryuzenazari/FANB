<template>
  <div class="privacy-view">
    <div class="privacy-container">
      <!-- Logo and Branding -->
      <div class="brand">
        <div class="logo">
          <span class="logo-text">FANB</span>
        </div>
        <p class="tagline">Focus. Arrange. Notify. Balance.</p>
      </div>

      <!-- Privacy Policy Content -->
      <div class="privacy-card">
        <div class="privacy-header">
          <h1>Kebijakan Privasi</h1>
          <p>Terakhir diperbarui: {{ lastUpdated }}</p>
        </div>

        <div class="privacy-content">
          <section>
            <h2>1. Pendahuluan</h2>
            <p>
              FANB ("kami", "kita", "FANB") berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan praktik kami 
              terkait pengumpulan, penggunaan, dan pengungkapan informasi yang kami kumpulkan dari pengguna aplikasi FANB.
            </p>
            <p>
              Dengan menggunakan FANB, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini. Silakan membacanya 
              dengan seksama untuk memahami bagaimana kami menangani informasi Anda.
            </p>
          </section>

          <section>
            <h2>2. Informasi yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan beberapa jenis informasi dari pengguna kami:</p>
            
            <h3>2.1 Informasi yang Anda Berikan</h3>
            <ul>
              <li>Informasi Akun: Nama, alamat email, nama pengguna, dan kata sandi Anda saat membuat akun.</li>
              <li>Profil: Informasi yang Anda tambahkan ke profil Anda seperti foto profil, zona waktu, dan preferensi.</li>
              <li>Konten Pengguna: Data yang Anda masukkan ke aplikasi seperti tugas, proyek, catatan, jadwal, dan kebiasaan.</li>
              <li>Komunikasi: Komunikasi apa pun yang Anda kirim kepada kami termasuk email dukungan dan umpan balik.</li>
              <li>Informasi Pembayaran: Untuk pengguna layanan premium, kami mengumpulkan informasi pembayaran melalui penyedia pembayaran pihak ketiga.</li>
            </ul>

            <h3>2.2 Informasi yang Kami Kumpulkan Secara Otomatis</h3>
            <ul>
              <li>Data Penggunaan: Informasi tentang bagaimana Anda menggunakan aplikasi, seperti fitur yang Anda akses, waktu dan durasi penggunaan.</li>
              <li>Informasi Perangkat: Jenis perangkat, sistem operasi, pengidentifikasi perangkat unik, alamat IP, dan informasi jaringan.</li>
              <li>Log dan Data Diagnostik: Log kesalahan, statistik kinerja, dan data diagnostik lainnya untuk meningkatkan layanan.</li>
              <li>Cookie dan Teknologi Pelacakan: Kami menggunakan cookie dan teknologi serupa untuk mengumpulkan informasi tentang penggunaan Anda.</li>
            </ul>
          </section>

          <section>
            <h2>3. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
            <ul>
              <li>Menyediakan, memelihara, dan meningkatkan layanan kami.</li>
              <li>Membuat dan mengelola akun Anda.</li>
              <li>Memproses transaksi dan mengirim pemberitahuan terkait transaksi.</li>
              <li>Menyesuaikan pengalaman pengguna Anda dan menyesuaikan konten.</li>
              <li>Menganalisis dan meningkatkan kinerja dan fungsionalitas aplikasi.</li>
              <li>Mengembangkan fitur dan produk baru.</li>
              <li>Mendeteksi, menyelidiki, dan mencegah aktivitas curang, penipuan, atau ilegal.</li>
              <li>Berkomunikasi dengan Anda tentang pembaruan, promosi, dan informasi terkait layanan.</li>
              <li>Mematuhi kewajiban hukum dan menanggapi permintaan dari otoritas pemerintah.</li>
            </ul>
          </section>

          <section>
            <h2>4. Berbagi Informasi Anda</h2>
            <p>Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Namun, kami dapat membagikan informasi dalam situasi berikut:</p>
            <ul>
              <li><strong>Penyedia Layanan:</strong> Kami bekerja sama dengan penyedia layanan pihak ketiga untuk membantu kami menyediakan, memelihara, dan meningkatkan layanan kami.</li>
              <li><strong>Mitra Bisnis:</strong> Kami dapat membagikan informasi dengan mitra bisnis untuk menyediakan produk atau layanan tertentu yang Anda minta.</li>
              <li><strong>Analitik:</strong> Kami menggunakan layanan analitik pihak ketiga untuk membantu kami memahami bagaimana pengguna menggunakan aplikasi kami.</li>
              <li><strong>Kepatuhan Hukum:</strong> Kami dapat mengungkapkan informasi jika diwajibkan secara hukum, atau jika kami percaya bahwa tindakan tersebut diperlukan untuk mematuhi hukum atau proses hukum.</li>
              <li><strong>Perlindungan Hak:</strong> Kami dapat mengungkapkan informasi untuk melindungi hak, properti, atau keselamatan kami, pengguna kami, atau orang lain.</li>
              <li><strong>Transfer Bisnis:</strong> Jika FANB terlibat dalam merger, akuisisi, atau penjualan aset, informasi Anda mungkin ditransfer sebagai bagian dari transaksi tersebut.</li>
              <li><strong>Dengan Izin Anda:</strong> Kami dapat membagikan informasi dengan pihak ketiga ketika Anda memberikan izin untuk melakukannya.</li>
            </ul>
          </section>

          <section>
            <h2>5. Data AI dan Personalisasi</h2>
            <p>
              FANB menggunakan teknologi kecerdasan buatan (AI) untuk meningkatkan pengalaman pengguna dan menyediakan fitur personalisasi. 
              Untuk mendukung fitur ini:
            </p>
            <ul>
              <li>Kami dapat memproses data penggunaan Anda untuk membuat rekomendasi yang dipersonalisasi.</li>
              <li>Algoritma AI kami menganalisis pola penggunaan, preferensi, dan data historis untuk meningkatkan produktivitas Anda.</li>
              <li>Data yang digunakan untuk pelatihan model AI kami dianonimkan dan diagregasi untuk melindungi privasi individu.</li>
              <li>Anda dapat mengontrol tingkat personalisasi dan penggunaan data AI melalui pengaturan aplikasi.</li>
            </ul>
          </section>

          <section>
            <h2>6. Keamanan Data</h2>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang dirancang untuk melindungi informasi pribadi Anda dari 
              akses, penggunaan, atau pengungkapan yang tidak sah. Langkah-langkah ini meliputi:
            </p>
            <ul>
              <li>Enkripsi data saat transit dan saat istirahat.</li>
              <li>Akses terbatas ke informasi pribadi berdasarkan prinsip kebutuhan untuk tahu.</li>
              <li>Penggunaan firewall, deteksi gangguan, dan sistem pencegahan.</li>
              <li>Tinjauan rutin atas praktik keamanan dan pengujian penetrasi.</li>
              <li>Pelatihan keamanan untuk karyawan dan kontraktor.</li>
            </ul>
            <p>
              Namun, tidak ada metode transmisi melalui Internet atau metode penyimpanan elektronik yang 100% aman. Oleh karena itu, meskipun 
              kami berusaha menggunakan cara yang dapat diterima secara komersial untuk melindungi informasi pribadi Anda, kami tidak dapat 
              menjamin keamanan mutlaknya.
            </p>
          </section>

          <section>
            <h2>7. Retensi Data</h2>
            <p>
              Kami menyimpan informasi pribadi Anda selama diperlukan untuk memenuhi tujuan yang diuraikan dalam Kebijakan Privasi ini, 
              kecuali jangka waktu penyimpanan yang lebih lama diperlukan atau diizinkan oleh hukum. Ketika menentukan periode retensi, 
              kami mempertimbangkan:
            </p>
            <ul>
              <li>Berapa lama informasi diperlukan untuk menyediakan layanan kami.</li>
              <li>Kewajiban hukum yang mungkin kami miliki.</li>
              <li>Batas waktu berdasarkan hukum yang berlaku.</li>
            </ul>
            <p>
              Ketika informasi pribadi tidak lagi diperlukan, kami akan menghapusnya atau menjadikannya anonim.
            </p>
          </section>

          <section>
            <h2>8. Hak Privasi Anda</h2>
            <p>Bergantung pada lokasi Anda, Anda mungkin memiliki hak tertentu terkait informasi pribadi Anda:</p>
            <ul>
              <li><strong>Akses:</strong> Anda dapat meminta salinan informasi pribadi yang kami simpan tentang Anda.</li>
              <li><strong>Koreksi:</strong> Anda dapat meminta kami untuk memperbaiki informasi yang tidak akurat atau tidak lengkap.</li>
              <li><strong>Penghapusan:</strong> Anda dapat meminta kami menghapus informasi pribadi Anda dalam keadaan tertentu.</li>
              <li><strong>Pembatasan:</strong> Anda dapat meminta kami membatasi penggunaan informasi Anda dalam keadaan tertentu.</li>
              <li><strong>Portabilitas Data:</strong> Anda dapat meminta salinan data Anda dalam format terstruktur dan dapat dibaca mesin.</li>
              <li><strong>Keberatan:</strong> Anda dapat keberatan atas pengolahan data tertentu, terutama untuk pemasaran langsung.</li>
              <li><strong>Persetujuan:</strong> Jika kami memproses informasi Anda berdasarkan persetujuan, Anda dapat menarik persetujuan kapan saja.</li>
            </ul>
            <p>
              Untuk menjalankan hak ini, silakan hubungi kami melalui informasi kontak di bawah. Kami akan menanggapi permintaan Anda sesuai 
              dengan hukum yang berlaku.
            </p>
          </section>

          <section>
            <h2>9. Anak-Anak</h2>
            <p>
              Layanan kami tidak ditujukan untuk anak-anak di bawah 13 tahun, dan kami tidak secara sengaja mengumpulkan informasi pribadi 
              dari anak-anak di bawah 13 tahun. Jika Anda adalah orang tua atau wali dan percaya bahwa anak Anda telah memberikan informasi 
              pribadi kepada kami, silakan hubungi kami. Jika kami mengetahui bahwa kami telah mengumpulkan informasi pribadi dari anak di 
              bawah 13 tahun tanpa verifikasi izin orang tua, kami akan mengambil langkah-langkah untuk menghapus informasi tersebut.
            </p>
          </section>

          <section>
            <h2>10. Transfer Data Internasional</h2>
            <p>
              Informasi Anda dapat ditransfer dan diproses di negara-negara selain negara tempat Anda tinggal. Negara-negara ini mungkin 
              memiliki undang-undang perlindungan data yang berbeda dari negara Anda. Dengan menggunakan layanan kami, Anda mengakui bahwa 
              informasi Anda dapat ditransfer ke sistem kami yang berada di luar negara Anda.
            </p>
            <p>
              Ketika kami mentransfer informasi pribadi dari Wilayah Ekonomi Eropa, Inggris, atau Swiss ke negara yang tidak memberikan 
              tingkat perlindungan yang memadai, kami gunakan mekanisme transfer data yang disetujui seperti Klausul Kontrak Standar.
            </p>
          </section>

          <section>
            <h2>11. Perubahan Pada Kebijakan Privasi Ini</h2>
            <p>
              Kami dapat merevisi Kebijakan Privasi ini dari waktu ke waktu. Versi terbaru akan selalu tersedia di situs web kami. 
              Jika perubahan bersifat material, kami akan memberikan pemberitahuan melalui aplikasi atau dengan cara lain untuk memberi 
              Anda kesempatan meninjau perubahan tersebut sebelum berlaku.
            </p>
            <p>
              Penggunaan layanan kami secara berkelanjutan setelah tanggal efektif Kebijakan Privasi yang direvisi merupakan penerimaan 
              Anda terhadap kebijakan yang direvisi.
            </p>
          </section>

          <section>
            <h2>12. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini atau praktik privasi kami, silakan hubungi kami di:
            </p>
            <p class="contact-info">
              Email: privacy@fanb-app.com<br>
              Alamat: Jl. Produktivitas No. 123, Jakarta, Indonesia
            </p>
          </section>
        </div>

        <div class="privacy-footer">
          <router-link to="/register" class="back-button">
            <span class="button-icon">←</span>
            <span>Kembali ke Halaman Pendaftaran</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Tanggal terakhir diperbarui
const lastUpdated = ref('5 Juni 2025');
</script>

<style scoped>
.privacy-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.privacy-container {
  width: 100%;
  max-width: 900px;
  z-index: 10;
  position: relative;
  margin: 2rem 0;
}

/* Logo and Branding */
.brand {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  color: #e5e7eb;
  font-size: 1rem;
  opacity: 0.8;
}

/* Privacy Card */
.privacy-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Privacy Header */
.privacy-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.privacy-header h1 {
  color: #f9fafb;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.privacy-header p {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Privacy Content */
.privacy-content {
  color: #e5e7eb;
  font-size: 0.95rem;
  line-height: 1.7;
}

.privacy-content section {
  margin-bottom: 2rem;
}

.privacy-content h2 {
  color: #f9fafb;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.privacy-content h3 {
  color: #f9fafb;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
}

.privacy-content p {
  margin-bottom: 1rem;
}

.privacy-content ul {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.privacy-content li {
  margin-bottom: 0.5rem;
}

.privacy-content strong {
  color: #f9fafb;
  font-weight: 600;
}

.contact-info {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

/* Privacy Footer */
.privacy-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: #e5e7eb;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.button-icon {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.back-button:hover .button-icon {
  transform: translateX(-4px);
}

/* Responsive */
@media (max-width: 768px) {
  .privacy-container {
    margin: 1rem 0;
  }
  
  .privacy-card {
    padding: 1.5rem;
  }

  .privacy-header h1 {
    font-size: 1.5rem;
  }

  .privacy-content {
    font-size: 0.875rem;
  }

  .privacy-content h2 {
    font-size: 1.125rem;
  }

  .privacy-content h3 {
    font-size: 1rem;
  }
}
</style> 