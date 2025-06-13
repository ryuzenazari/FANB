<template>
  <div class="static-page careers-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Karier di FANB</h1>
        <p class="page-subtitle">Bergabunglah dengan tim kami untuk membangun masa depan produktivitas</p>
      </div>

      <div class="careers-hero">
        <div class="hero-content">
          <h2>Mengapa FANB?</h2>
          <p>Di FANB, kami percaya bahwa produktivitas sejati berasal dari keseimbangan. Kami tidak hanya membangun produk untuk membantu orang lain mencapai keseimbangan ini, tetapi kami juga menerapkannya pada diri kami sendiri.</p>
          <p>Sebagai anggota tim FANB, Anda akan bekerja dengan para profesional berbakat yang berkomitmen pada inovasi, kualitas, dan dampak positif. Kami menghargai perspektif beragam dan mendorong pertumbuhan melalui kolaborasi dan tantangan.</p>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">25+</div>
              <div class="stat-label">Anggota Tim</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">6</div>
              <div class="stat-label">Negara</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">80%</div>
              <div class="stat-label">Remote</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">4.8/5</div>
              <div class="stat-label">Rating Karyawan</div>
            </div>
          </div>
        </div>
        
        <div class="hero-image">
          <div class="image-placeholder">
            <div class="overlay-text">Tim FANB</div>
          </div>
        </div>
      </div>

      <div class="benefits-section">
        <h2>Manfaat Bekerja di FANB</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">💻</div>
            <h3>Kerja Fleksibel</h3>
            <p>Kebijakan kerja remote yang memungkinkan Anda bekerja dari mana saja dengan beberapa pertemuan di kantor.</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon">🌱</div>
            <h3>Pengembangan Karier</h3>
            <p>Anggaran pembelajaran tahunan, workshop internal, dan jalur karier yang jelas untuk pertumbuhan Anda.</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon">🏥</div>
            <h3>Kesehatan & Kesejahteraan</h3>
            <p>Asuransi kesehatan komprehensif, program kesejahteraan, dan dukungan kesehatan mental.</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon">🏝️</div>
            <h3>Cuti yang Cukup</h3>
            <p>Cuti berbayar yang murah hati, cuti sakit tak terbatas, dan kebijakan waktu istirahat yang menghormati batasan.</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon">💰</div>
            <h3>Kompensasi Kompetitif</h3>
            <p>Gaji yang kompetitif dengan opsi saham untuk memastikan Anda mendapat bagian dari kesuksesan kami.</p>
          </div>
          
          <div class="benefit-card">
            <div class="benefit-icon">🎉</div>
            <h3>Budaya yang Inklusif</h3>
            <p>Lingkungan yang mendukung di mana semua suara dihargai dan keragaman dirayakan.</p>
          </div>
        </div>
      </div>

      <div class="open-positions">
        <h2>Lowongan Saat Ini</h2>
        <p class="positions-intro">Kami sedang mencari individu berbakat untuk bergabung dengan tim kami yang berkembang pesat. Jelajahi posisi yang tersedia di bawah ini.</p>
        
        <div class="departments-tabs">
          <button 
            v-for="dept in departments" 
            :key="dept.id"
            :class="{ 'active': activeDepartment === dept.id }"
            @click="activeDepartment = dept.id"
          >
            {{ dept.name }}
          </button>
        </div>
        
        <div class="positions-list">
          <div 
            v-for="(position, index) in filteredPositions" 
            :key="index"
            class="position-card"
          >
            <div class="position-info">
              <h3>{{ position.title }}</h3>
              <div class="position-meta">
                <span class="location">{{ position.location }}</span>
                <span class="department-badge">{{ position.department }}</span>
                <span class="type-badge">{{ position.type }}</span>
              </div>
              <p class="position-summary">{{ position.summary }}</p>
            </div>
            <a href="#" class="apply-button">Lamar</a>
          </div>
          
          <div v-if="filteredPositions.length === 0" class="no-positions">
            <p>Tidak ada posisi yang tersedia di departemen ini saat ini. Silakan periksa kembali nanti atau pertimbangkan departemen lain.</p>
          </div>
        </div>
      </div>

      <div class="culture-section">
        <h2>Budaya Kami</h2>
        <div class="culture-grid">
          <div class="culture-item">
            <h3>Keseimbangan</h3>
            <p>Kami percaya keseimbangan antara pekerjaan dan kehidupan adalah kunci produktivitas jangka panjang. Kami menghormati waktu pribadi dan mendorong istirahat yang cukup.</p>
          </div>
          
          <div class="culture-item">
            <h3>Transparansi</h3>
            <p>Kami beroperasi dengan transparansi di semua level. Pengambilan keputusan, kemajuan perusahaan, dan umpan balik dibagikan secara terbuka.</p>
          </div>
          
          <div class="culture-item">
            <h3>Pemberdayaan</h3>
            <p>Kami memberdayakan setiap anggota tim untuk mengambil keputusan dan memiliki tanggung jawab atas area mereka, menumbuhkan rasa kepemilikan.</p>
          </div>
          
          <div class="culture-item">
            <h3>Empati</h3>
            <p>Kami membangun produk dengan empati pada pengguna, dan menjalankan tim kami dengan prinsip yang sama, menghargai pengalaman unik setiap orang.</p>
          </div>
        </div>
      </div>

      <div class="application-process">
        <h2>Proses Aplikasi</h2>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Aplikasi</h3>
              <p>Kirimkan resume dan surat lamaran Anda. Kami akan meninjau dan menghubungi kandidat yang memenuhi syarat dalam 5-7 hari kerja.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Wawancara Awal</h3>
              <p>Wawancara video 30 menit dengan rekruter kami untuk membahas latar belakang, keahlian, dan kecocokan dengan peran dan budaya.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Penilaian Teknis</h3>
              <p>Bergantung pada peran, Anda mungkin diminta untuk menyelesaikan tugas teknis atau studi kasus untuk mendemonstrasikan keahlian Anda.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Wawancara Tim</h3>
              <p>Sesi dengan anggota tim dan manajer terkait untuk menilai keahlian teknis dan kecocokan budaya secara lebih mendalam.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">5</div>
            <div class="step-content">
              <h3>Penawaran</h3>
              <p>Kandidat sukses akan menerima penawaran. Kami bertujuan untuk membuat seluruh proses selesai dalam 2-3 minggu.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="cta-section">
        <h2>Tidak Melihat Posisi yang Cocok?</h2>
        <p>Kami selalu mencari orang-orang berbakat. Kirimkan aplikasi umum dan kami akan menghubungi Anda jika ada posisi yang sesuai dengan keahlian Anda.</p>
        <a href="mailto:careers@fanb.com" class="cta-button">Kirim Aplikasi Umum</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Departments for filtering
const departments = [
  { id: 'all', name: 'Semua Departemen' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'product', name: 'Product' },
  { id: 'design', name: 'Design' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'customer', name: 'Customer Success' },
  { id: 'operations', name: 'Operations' }
];

const activeDepartment = ref('all');

// Job positions data
const positions = [
  {
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote (Indonesia)',
    type: 'Full-time',
    summary: 'Kami mencari pengembang frontend berpengalaman untuk membantu kami membangun dan meningkatkan aplikasi web kami dengan fokus pada pengalaman pengguna dan performa.'
  },
  {
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Jakarta / Remote',
    type: 'Full-time',
    summary: 'Bergabunglah dengan tim desain kami untuk menciptakan antarmuka yang intuitif dan visual yang menawan untuk aplikasi produktivitas kami.'
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'Jakarta',
    type: 'Full-time',
    summary: 'Mencari product manager berpengalaman untuk membantu mengarahkan pengembangan produk kami, bekerja sama dengan tim lintas fungsi.'
  },
  {
    title: 'Growth Marketing Specialist',
    department: 'Marketing',
    location: 'Remote (Indonesia)',
    type: 'Full-time',
    summary: 'Bantu kami mengembangkan basis pengguna kami melalui strategi pemasaran digital yang data-driven dan kampanye akuisisi yang kreatif.'
  },
  {
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Remote (Indonesia)',
    type: 'Full-time',
    summary: 'Membangun dan memelihara infrastruktur backend yang skalabel dan aman untuk mendukung aplikasi produktivitas kami yang berkembang pesat.'
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer',
    location: 'Jakarta / Remote',
    type: 'Full-time',
    summary: 'Pastikan pengguna kami mendapatkan nilai maksimal dari platform FANB, memberikan dukungan luar biasa dan membangun hubungan jangka panjang.'
  }
];

// Filtered positions based on active department
const filteredPositions = computed(() => {
  if (activeDepartment.value === 'all') {
    return positions;
  }
  
  // Map department IDs to their display names for filtering
  const deptNameMap: Record<string, string> = {
    'engineering': 'Engineering',
    'product': 'Product',
    'design': 'Design',
    'marketing': 'Marketing',
    'customer': 'Customer',
    'operations': 'Operations'
  };
  
  return positions.filter(position => position.department === deptNameMap[activeDepartment.value]);
});
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

.careers-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 5rem;
  align-items: center;
}

.hero-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.hero-content p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;
}

.stat-item {
  text-align: center;
  background: rgba(30, 41, 59, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.hero-image {
  position: relative;
}

.image-placeholder {
  width: 100%;
  padding-top: 75%; /* 4:3 Aspect Ratio */
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.3), rgba(189, 52, 254, 0.3));
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
}

.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.benefits-section {
  margin-bottom: 5rem;
}

.benefits-section h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.benefit-card {
  background: rgba(30, 41, 59, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.benefit-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.benefit-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.benefit-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.open-positions {
  margin-bottom: 5rem;
}

.open-positions h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.positions-intro {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.125rem;
  max-width: 700px;
  margin: 0 auto 3rem;
}

.departments-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.departments-tabs button {
  background: rgba(30, 41, 59, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.departments-tabs button:hover {
  background: rgba(30, 41, 59, 0.4);
  color: var(--text-primary);
}

.departments-tabs button.active {
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(189, 52, 254, 0.2));
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  font-weight: 600;
}

.positions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.position-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.2);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.position-card:hover {
  background: rgba(30, 41, 59, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

.position-info {
  flex-grow: 1;
}

.position-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.position-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.location {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.location::before {
  content: '📍';
}

.department-badge,
.type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.department-badge {
  background: rgba(84, 105, 255, 0.2);
  color: var(--primary);
}

.type-badge {
  background: rgba(189, 52, 254, 0.2);
  color: var(--secondary);
}

.position-summary {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  max-width: 600px;
}

.apply-button {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.apply-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(84, 105, 255, 0.4);
}

.no-positions {
  text-align: center;
  padding: 3rem;
  background: rgba(30, 41, 59, 0.2);
  border-radius: 12px;
  color: var(--text-secondary);
}

.culture-section {
  margin-bottom: 5rem;
}

.culture-section h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
}

.culture-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.culture-item {
  background: rgba(30, 41, 59, 0.2);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.culture-item h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.culture-item p {
  color: var(--text-secondary);
  line-height: 1.7;
}

.application-process {
  margin-bottom: 5rem;
}

.application-process h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.process-step {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(189, 52, 254, 0.2));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 4rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cta-section h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-section p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -5px rgba(84, 105, 255, 0.5);
}

@media (max-width: 1024px) {
  .careers-hero {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .culture-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-section {
    padding: 3rem 2rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .position-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .apply-button {
    align-self: center;
  }
  
  .stats-grid {
    gap: 1rem;
  }
}
</style> 