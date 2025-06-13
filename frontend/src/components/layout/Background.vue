<template>
  <div class="background-elements">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>
    <div class="bg-grid"></div>
  </div>
</template>

<script setup lang="ts">
// Background component with grid and blobs
</script>

<style scoped>
/* Background Elements */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none; /* Memastikan background tidak menghalangi klik */
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, rgba(84, 105, 255, 0.2), rgba(189, 52, 254, 0.1));
  top: -200px;
  right: -100px;
  animation: float 25s ease-in-out infinite alternate;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(84, 105, 255, 0.05));
  bottom: -100px;
  left: -200px;
  animation: float 20s ease-in-out infinite alternate-reverse;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(189, 52, 254, 0.15), rgba(255, 107, 107, 0.05));
  top: 40%;
  left: 60%;
  animation: float 15s ease-in-out infinite alternate;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(30px, 30px) rotate(10deg); }
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}
</style> 