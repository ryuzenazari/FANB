<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <div class="error-code">
          <span class="digit">4</span>
          <div class="digit-animation">
            <span class="digit">0</span>
          </div>
          <span class="digit">4</span>
        </div>
        
        <h1 class="error-title">Halaman Tidak Ditemukan</h1>
        <p class="error-message">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        
        <div class="action-buttons">
          <button class="btn-primary" @click="goBack">
            <span class="btn-icon">←</span>
            <span>Kembali</span>
          </button>
          <button class="btn-outline" @click="goHome">
            <span>Ke Beranda</span>
          </button>
        </div>
      </div>
      
      <div class="illustration">
        <!-- Gambar astronot dari internet -->
        <div class="astronaut-container">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/6989/6989363.png" 
            alt="Astronot melayang" 
            class="astronaut-image"
          />
        </div>

        <div class="planet"></div>
        <div class="stars">
          <div class="star" v-for="n in 20" :key="n"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Gunakan history API browser alih-alih vue-router yang mungkin belum diinstal
const goBack = () => {
  window.history.back();
};

const goHome = () => {
  window.location.href = '/';
};
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: var(--text-primary, #F9FAFB);
}

.container {
  width: 100%;
  max-width: 1200px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rem;
}

/* Error Content */
.error-content {
  text-align: center;
  animation: fadeIn 0.8s ease-out;
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

.error-code {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1;
}

.digit {
  display: inline-block;
  background: linear-gradient(to bottom, var(--text-primary, #F9FAFB), var(--text-secondary, #CED3DB));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.digit-animation {
  position: relative;
  width: 8rem;
  height: 8rem;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.digit-animation .digit {
  background: linear-gradient(to bottom, var(--primary, #5469FF), var(--secondary, #BD34FE));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rotate 8s infinite;
}

@keyframes rotate {
  0%, 20%, 100% {
    transform: rotateY(0);
  }
  25%, 45% {
    transform: rotateY(180deg);
  }
  50%, 70% {
    transform: rotateY(360deg);
  }
  75%, 95% {
    transform: rotateY(540deg);
  }
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--text-primary, #F9FAFB), var(--text-secondary, #CED3DB));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-message {
  font-size: 1.125rem;
  color: var(--text-secondary, #CED3DB);
  max-width: 500px;
  margin: 0 auto 2rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, var(--primary, #5469FF), var(--secondary, #BD34FE));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(84, 105, 255, 0.5);
}

.btn-icon {
  font-size: 1.125rem;
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-icon {
  transform: translateX(-4px);
}

.btn-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: var(--text-primary, #F9FAFB);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Illustration */
.illustration {
  position: relative;
  width: 300px;
  height: 300px;
  animation: float 6s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Astronot dari internet */
.astronaut-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 150px;
  height: 150px;
  z-index: 5;
  animation: astroFloat 6s infinite ease-in-out alternate;
}

.astronaut-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 5px 15px rgba(84, 105, 255, 0.5));
}

@keyframes astroFloat {
  0% {
    transform: translate(-50%, -60%) rotate(-5deg);
  }
  50% {
    transform: translate(-50%, -70%) rotate(5deg);
  }
  100% {
    transform: translate(-50%, -60%) rotate(-5deg);
  }
}

.planet {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, var(--primary, #5469FF), var(--secondary, #BD34FE));
  border-radius: 50%;
  opacity: 0.3;
  box-shadow: 0 0 40px rgba(84, 105, 255, 0.8);
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  opacity: 0.7;
  animation: twinkle 4s infinite;
}

.star:nth-child(even) {
  width: 2px;
  height: 2px;
  animation-delay: 1s;
}

.star:nth-child(3n) {
  width: 4px;
  height: 4px;
  animation-delay: 2s;
}

.star:nth-child(5n) {
  animation-delay: 3s;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    gap: 3rem;
  }
  
  .error-code {
    font-size: 6rem;
  }
  
  .digit-animation {
    width: 6rem;
    height: 6rem;
  }
  
  .error-title {
    font-size: 1.75rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .btn-primary, .btn-outline {
    width: 100%;
  }
  
  .illustration {
    width: 250px;
    height: 250px;
  }

  .astronaut-container {
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 5rem;
  }
  
  .digit-animation {
    width: 5rem;
    height: 5rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .illustration {
    width: 200px;
    height: 200px;
  }

  .astronaut-container {
    width: 100px;
    height: 100px;
  }
}
</style> 