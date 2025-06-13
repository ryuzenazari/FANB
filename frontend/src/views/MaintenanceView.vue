<script setup lang="ts">
import { ref } from 'vue'

const estimatedTime = ref('2 jam')
const currentTime = new Date().toLocaleTimeString('id-ID', {
  hour: '2-digit',
  minute: '2-digit'
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <svg class="mx-auto h-24 w-24 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>

      <h1 class="text-4xl font-bold text-white mb-4">
        Sedang Dalam Pemeliharaan
      </h1>

      <p class="text-xl text-gray-400 mb-8">
        Kami sedang melakukan pemeliharaan untuk meningkatkan layanan kami. Mohon maaf atas ketidaknyamanannya.
      </p>

      <div class="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Perkiraan Waktu Selesai:</span>
            <span class="text-white font-semibold">{{ estimatedTime }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Waktu Saat Ini:</span>
            <span class="text-white font-semibold">{{ currentTime }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <p class="text-gray-400">
          Untuk informasi lebih lanjut, silakan hubungi tim dukungan kami di:
        </p>
        <a href="mailto:support@fanb.app" 
           class="text-blue-500 hover:text-blue-400 font-semibold">
          support@fanb.app
        </a>
      </div>

      <div class="mt-12">
        <div class="animate-pulse">
          <div class="h-2 w-32 bg-gray-700 rounded mx-auto"></div>
          <div class="h-2 w-24 bg-gray-700 rounded mx-auto mt-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gray-900 {
  background-color: #111827;
}

.bg-gray-800 {
  background-color: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(10px);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 