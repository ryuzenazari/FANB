<template>
  <div class="terms-view">
    <div class="terms-container">
      <!-- Logo and Branding -->
      <div class="brand">
        <div class="logo">
          <span class="logo-text">FANB</span>
        </div>
        <p class="tagline">Focus. Arrange. Notify. Balance.</p>
      </div>

      <!-- Terms of Service Content -->
      <div class="terms-card">
        <div class="terms-header">
          <h1>Syarat & Ketentuan</h1>
          <p>Terakhir diperbarui: {{ lastUpdated }}</p>
        </div>

        <div class="terms-content">
          <section>
            <h2>1. Pendahuluan</h2>
            <p>
              Selamat datang di FANB ("Kami", "Kita", "FANB", "Aplikasi"). Dengan mengakses atau menggunakan layanan FANB, 
              Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui sebagian atau seluruh 
              isi dari syarat dan ketentuan ini, Anda tidak berhak menggunakan layanan FANB.
            </p>
          </section>

          <section>
            <h2>2. Definisi Layanan</h2>
            <p>
              FANB merupakan platform manajemen diri digital yang menyediakan alat untuk pengelolaan tugas, proyek, 
              kebiasaan, dan produktivitas personal. Layanan kami mencakup, namun tidak terbatas pada:
            </p>
            <ul>
              <li>Manajemen dan pelacakan tugas personal</li>
              <li>Manajemen dan pemantauan proyek</li>
              <li>Pelacakan dan pengembangan kebiasaan</li>
              <li>Analitik dan visualisasi produktivitas</li>
              <li>Asisten AI untuk peningkatan produktivitas</li>
              <li>Fitur kalender dan pengingat</li>
            </ul>
          </section>

          <section>
            <h2>3. Akun Pengguna</h2>
            <p>
              Untuk menggunakan sebagian besar fitur FANB, Anda perlu membuat akun. Anda bertanggung jawab untuk menjaga 
              kerahasiaan informasi akun Anda, termasuk kata sandi, dan bertanggung jawab penuh atas segala aktivitas yang 
              terjadi di dalam akun Anda.
            </p>
            <p>Anda setuju untuk:</p>
            <ul>
              <li>Memberikan informasi yang akurat, terbaru dan lengkap saat mendaftar</li>
              <li>Menjaga dan segera memperbarui informasi akun</li>
              <li>Menjaga keamanan akun dan kata sandi Anda</li>
              <li>Memberi tahu kami segera jika ada penggunaan tidak sah atas akun Anda</li>
              <li>Bertanggung jawab atas segala aktivitas yang terjadi menggunakan akun Anda</li>
            </ul>
          </section>

          <section>
            <h2>4. Lisensi Penggunaan</h2>
            <p>
              FANB memberikan Anda lisensi terbatas, non-eksklusif, tidak dapat dipindahtangankan, dan dapat dicabut 
              untuk menggunakan Aplikasi sesuai dengan syarat dan ketentuan ini. Lisensi ini dimaksudkan semata-mata 
              untuk memungkinkan Anda menggunakan dan menikmati manfaat layanan sesuai yang diizinkan.
            </p>
          </section>

          <section>
            <h2>5. Batasan Penggunaan</h2>
            <p>Anda tidak diperkenankan:</p>
            <ul>
              <li>Menggunakan layanan untuk tujuan ilegal atau tidak sah</li>
              <li>Melanggar hak kekayaan intelektual milik FANB atau pihak ketiga</li>
              <li>Melakukan rekayasa balik, mendekompilasi, atau membongkar perangkat lunak FANB</li>
              <li>Menggunakan bot, spider, crawler atau alat otomatis lain untuk mengakses layanan</li>
              <li>Mengganggu atau mengganggu integritas atau kinerja layanan</li>
              <li>Mencoba untuk mendapatkan akses tidak sah ke sistem atau jaringan terkait layanan</li>
              <li>Menjual kembali atau mengkomersialkan layanan tanpa izin tertulis dari FANB</li>
            </ul>
          </section>

          <section>
            <h2>6. Konten Pengguna</h2>
            <p>
              Anda mempertahankan hak atas konten yang Anda unggah, buat atau bagikan melalui FANB ("Konten Pengguna"). 
              Dengan mengunggah Konten Pengguna, Anda memberikan FANB lisensi non-eksklusif untuk menggunakan, menyimpan, 
              menampilkan, dan mendistribusikan konten tersebut untuk tujuan menyediakan dan meningkatkan layanan.
            </p>
            <p>
              Anda bertanggung jawab penuh atas Konten Pengguna Anda dan konsekuensi dari unggahan, publikasi, atau 
              berbagi konten tersebut. Anda menyatakan dan menjamin bahwa Anda memiliki hak yang diperlukan untuk 
              memberikan FANB lisensi sebagaimana dijelaskan di atas.
            </p>
          </section>

          <section>
            <h2>7. Layanan Premium dan Pembayaran</h2>
            <p>
              FANB menawarkan layanan gratis dan berbayar. Untuk layanan premium, biaya akan diuraikan secara jelas 
              sebelum Anda melakukan pembelian. Dengan membeli layanan premium, Anda setuju:
            </p>
            <ul>
              <li>Memberikan informasi pembayaran yang akurat dan lengkap</li>
              <li>Bahwa kami dapat menagih akun pembayaran Anda secara berulang untuk layanan berlangganan</li>
              <li>Untuk memperbarui informasi pembayaran jika diperlukan</li>
            </ul>
            <p>
              Harga dapat berubah sewaktu-waktu, namun perubahan harga hanya akan berlaku untuk periode berlangganan 
              masa depan dan Anda akan diberi tahu sebelum perubahan harga berlaku.
            </p>
          </section>

          <section>
            <h2>8. Penghentian</h2>
            <p>
              FANB dapat, atas kebijakannya sendiri dan tanpa pemberitahuan sebelumnya, menghentikan akses Anda ke 
              layanan jika Anda melanggar Syarat & Ketentuan ini. Anda dapat berhenti menggunakan layanan kapan saja 
              dan menghentikan akun Anda dengan mengikuti prosedur penghapusan akun dalam pengaturan.
            </p>
          </section>

          <section>
            <h2>9. Perubahan pada Layanan</h2>
            <p>
              FANB berhak untuk memodifikasi, menangguhkan, atau menghentikan layanan (atau bagian dari layanan) kapan saja 
              dengan atau tanpa pemberitahuan. FANB tidak bertanggung jawab kepada Anda atau pihak ketiga mana pun jika 
              menggunakan hak ini.
            </p>
          </section>

          <section>
            <h2>10. Perubahan pada Syarat & Ketentuan</h2>
            <p>
              Kami dapat merevisi Syarat & Ketentuan ini dari waktu ke waktu. Versi terbaru akan selalu tersedia di situs kami. 
              Dengan terus menggunakan layanan kami setelah revisi menjadi efektif, Anda setuju untuk terikat oleh syarat yang direvisi.
            </p>
          </section>

          <section>
            <h2>11. Disclaimer Jaminan</h2>
            <p>
              FANB menyediakan layanannya "sebagaimana adanya" dan "sebagaimana tersedia" tanpa jaminan apa pun. Kami tidak 
              menjamin bahwa layanan akan bebas dari gangguan, tepat waktu, aman, atau bebas kesalahan.
            </p>
          </section>

          <section>
            <h2>12. Batasan Tanggung Jawab</h2>
            <p>
              FANB tidak akan bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, atau 
              hukuman, termasuk kehilangan keuntungan, data, atau goodwill, yang timbul dari atau sehubungan dengan Syarat ini.
            </p>
          </section>

          <section>
            <h2>13. Hukum yang Berlaku</h2>
            <p>
              Syarat & Ketentuan ini akan diatur oleh dan ditafsirkan sesuai dengan hukum Indonesia, tanpa memperhatikan 
              konflik ketentuan hukum.
            </p>
          </section>

          <section>
            <h2>14. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami di:
            </p>
            <p class="contact-info">
              Email: support@fanb-app.com<br>
              Alamat: Jl. Produktivitas No. 123, Jakarta, Indonesia
            </p>
          </section>
        </div>

        <div class="terms-footer">
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
.terms-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.terms-container {
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

/* Terms Card */
.terms-card {
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

/* Terms Header */
.terms-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.terms-header h1 {
  color: #f9fafb;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.terms-header p {
  color: #9ca3af;
  font-size: 0.875rem;
}

/* Terms Content */
.terms-content {
  color: #e5e7eb;
  font-size: 0.95rem;
  line-height: 1.7;
}

.terms-content section {
  margin-bottom: 2rem;
}

.terms-content h2 {
  color: #f9fafb;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.terms-content p {
  margin-bottom: 1rem;
}

.terms-content ul {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.terms-content li {
  margin-bottom: 0.5rem;
}

.contact-info {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

/* Terms Footer */
.terms-footer {
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
  .terms-container {
    margin: 1rem 0;
  }
  
  .terms-card {
    padding: 1.5rem;
  }

  .terms-header h1 {
    font-size: 1.5rem;
  }

  .terms-content {
    font-size: 0.875rem;
  }

  .terms-content h2 {
    font-size: 1.125rem;
  }
}
</style> 