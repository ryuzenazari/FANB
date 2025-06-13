<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick, onUnmounted } from 'vue';
import Chart from 'chart.js/auto';
import dashboardService from '../../services/dashboardService';

// Interface untuk data dashboard
export interface DashboardData {
  chartData: {
    taskData: { completed: number[]; pending: number[] };
    habitData: number[];
    focusData: number[];
  };
}

// Props
const props = defineProps<{
  chartData?: {
    taskData: { completed: number[]; pending: number[] };
    habitData: number[];
    focusData: number[];
  }
}>();

// State
const loading = ref(true);
const error = ref<string | null>(null);
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chartContainer = ref<HTMLDivElement | null>(null);
const chart = ref<Chart | null>(null);
const activeTab = ref('tasks');
const dashboardData = ref<DashboardData | null>(null);
const chartIsReady = ref(false);
const isRendering = ref(false);
const resizeObserver = ref<ResizeObserver | null>(null);
const setupAttempts = ref(0); // Counter untuk percobaan setup chart
const renderAttempts = ref(0); // Counter untuk percobaan render

// Tabs
const tabs = [
  { id: 'tasks', label: 'Tugas' },
  { id: 'habits', label: 'Kebiasaan' },
  { id: 'focus', label: 'Fokus' }
];

// Methods
const fetchData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (!props.chartData) {
      // Gunakan data dari API tanpa fallback dummy
      const response = await dashboardService.getDashboardAnalytics();
      if (response.success) {
        dashboardData.value = { chartData: response.data };
      } else {
        // Fallback data dummy jika API error
        console.warn('Menggunakan data dummy karena API error');
        dashboardData.value = { 
          chartData: {
            taskData: { 
              completed: [5, 7, 8, 10, 9, 12, 7],
              pending: [2, 3, 4, 3, 5, 4, 2]
            },
            habitData: [3, 4, 5, 4, 6, 7, 8],
            focusData: [30, 45, 60, 50, 70, 65, 75]
          }
        };
        error.value = 'Menggunakan data dummy (API tidak tersedia)';
      }
    }
    
    loading.value = false;
  } catch (err: any) {
    console.error('Error mengambil data chart:', err);
    
    // Fallback data dummy jika API error
    console.warn('Menggunakan data dummy karena error API');
    dashboardData.value = { 
      chartData: {
        taskData: { 
          completed: [5, 7, 8, 10, 9, 12, 7],
          pending: [2, 3, 4, 3, 5, 4, 2]
        },
        habitData: [3, 4, 5, 4, 6, 7, 8],
        focusData: [30, 45, 60, 50, 70, 65, 75]
      }
    };
    error.value = 'Menggunakan data dummy karena error API: ' + (err.message || 'Unknown error');
    loading.value = false;
  }
};

// Computed
const chartDataSource = computed(() => {
  return props.chartData || dashboardData.value?.chartData;
});

// Periksa apakah data chart kosong
const isEmptyChartData = computed(() => {
  if (!chartDataSource.value) return true;
  
  // Periksa data tugas
  const taskCompleted = chartDataSource.value.taskData?.completed || [];
  const taskPending = chartDataSource.value.taskData?.pending || [];
  const habitData = chartDataSource.value.habitData || [];
  const focusData = chartDataSource.value.focusData || [];
  
  // Jika semua data adalah array kosong atau semua nilainya 0
  const isTaskEmpty = taskCompleted.length === 0 || taskCompleted.every(val => val === 0);
  const isTaskPendingEmpty = taskPending.length === 0 || taskPending.every(val => val === 0);
  const isHabitEmpty = habitData.length === 0 || habitData.every(val => val === 0);
  const isFocusEmpty = focusData.length === 0 || focusData.every(val => val === 0);
  
  // Jika tab aktif tertentu kosong, kembalikan true
  if (activeTab.value === 'tasks' && isTaskEmpty && isTaskPendingEmpty) return true;
  if (activeTab.value === 'habits' && isHabitEmpty) return true;
  if (activeTab.value === 'focus' && isFocusEmpty) return true;
  
  return false;
});

// Get labels for the last 7 days
const dateLabels = computed(() => {
  const labels = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    labels.push(date.toLocaleDateString('id-ID', { weekday: 'short' }));
  }
  
  return labels;
});

// Setup ResizeObserver untuk menangani perubahan ukuran container
const setupResizeObserver = () => {
  if (typeof ResizeObserver !== 'undefined' && chartContainer.value) {
    resizeObserver.value = new ResizeObserver(async (entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        if (!isRendering.value && chartIsReady.value) {
          await nextTick();
          setupChart();
        }
      }
    });
    
    resizeObserver.value.observe(chartContainer.value);
  }
};

// Setup chart based on active tab
const setupChart = async () => {
  if (isRendering.value) return;
  isRendering.value = true;
  
  try {
    // Periksa apakah data kosong
    if (isEmptyChartData.value) {
      console.log('Data chart kosong, tidak perlu merender');
      chartIsReady.value = true;
      isRendering.value = false;
      return;
    }
    
    // Periksa apakah canvas dan data tersedia
    if (!chartCanvas.value || !chartDataSource.value || !chartContainer.value) {
      console.warn('Canvas, container, atau data chart belum tersedia');
      error.value = 'Tidak dapat menampilkan chart';
      isRendering.value = false;
      return;
    }
    
    // Destroy existing chart if it exists
    if (chart.value) {
      chart.value.destroy();
      chart.value = null;
    }
    
    // Pastikan container sudah di-render dengan benar
    const container = chartContainer.value;
    const containerWidth = container.clientWidth || container.offsetWidth;
    const containerHeight = container.clientHeight || container.offsetHeight;
    
    if (!containerWidth || !containerHeight) {
      console.warn('Container chart tidak memiliki dimensi yang valid');
      error.value = 'Tidak dapat menampilkan chart';
      isRendering.value = false;
      return;
    }
    
    // Set dimensi canvas secara eksplisit
    const canvas = chartCanvas.value;
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Tidak dapat mendapatkan konteks canvas');
      error.value = 'Gagal mendapatkan konteks canvas';
      return;
    }
    
    // Definisikan tipe untuk dataset
    type ChartDataset = {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      tension: number;
    };
    
    let datasets: ChartDataset[] = [];
    
    if (activeTab.value === 'tasks') {
      datasets = [
        {
          label: 'Selesai',
          data: chartDataSource.value.taskData.completed,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Pending',
          data: chartDataSource.value.taskData.pending,
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          borderColor: 'rgba(249, 115, 22, 1)',
          borderWidth: 2,
          tension: 0.3
        }
      ];
    } else if (activeTab.value === 'habits') {
      datasets = [
        {
          label: 'Kebiasaan',
          data: chartDataSource.value.habitData,
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 2,
          tension: 0.3
        }
      ];
    } else if (activeTab.value === 'focus') {
      datasets = [
        {
          label: 'Menit Fokus',
          data: chartDataSource.value.focusData,
          backgroundColor: 'rgba(236, 72, 153, 0.2)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 2,
          tension: 0.3
        }
      ];
    }
    
    // Set global Chart.js defaults
    Chart.defaults.animation = false; // Matikan animasi untuk menghindari error
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    
    chart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateLabels.value,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // Matikan animasi untuk menghindari error
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(71, 85, 105, 0.2)'
            },
            ticks: {
              color: '#94a3b8',
              padding: 10,
              font: {
                size: 11
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8',
              font: {
                size: 11
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: '#cbd5e1',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15,
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(51, 65, 85, 0.5)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 6,
            displayColors: true,
            boxPadding: 5,
            usePointStyle: true
          }
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6,
            borderWidth: 2
          },
          line: {
            borderWidth: 3,
            fill: true,
            tension: 0.3
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'index',
          intersect: false
        }
      }
    });
    
    chartIsReady.value = true;
  } catch (err: any) {
    console.error('Error rendering chart:', err);
    error.value = `Error rendering chart: ${err.message || 'Unknown error'}`;
  } finally {
    isRendering.value = false;
  }
};

// Lifecycle hooks
onMounted(async () => {
  await fetchData();
  
  // Reset counter percobaan setiap kali komponen di-mount
  setupAttempts.value = 0;
  renderAttempts.value = 0;
  
  // Tampilkan pesan data kosong jika tidak ada data
  if (isEmptyChartData.value) {
    console.log('Data chart kosong, tidak perlu merender');
    chartIsReady.value = true;
    return;
  }
  
  // Gunakan timeout sederhana untuk memastikan DOM siap
  setTimeout(() => {
    if (chartContainer.value && chartCanvas.value) {
      setupChart();
      setupResizeObserver();
    } else {
      console.warn('Chart container tidak tersedia, tidak merender chart');
      error.value = 'Tidak dapat menampilkan chart';
    }
  }, 500);
});

// Clean up on unmount
onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
  }
  
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

// Watch for changes in active tab
watch(activeTab, async () => {
  if (chartIsReady.value && chartContainer.value && chartCanvas.value) {
    await setupChart();
  }
});

// Watch for changes in chart data
watch(() => props.chartData, async () => {
  if (chartIsReady.value && chartContainer.value && chartCanvas.value) {
    await setupChart();
  }
}, { deep: true });
</script>

<template>
  <div class="chart-container">
    <div v-if="loading" class="loading-indicator">
      <div class="loading-spinner"></div>
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else class="chart-wrapper">
      <!-- Tab Navigation -->
      <div class="chart-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <!-- Empty data message -->
      <div v-if="isEmptyChartData" class="empty-data-message">
        <div class="empty-icon">📊</div>
        <p>Belum ada data untuk ditampilkan</p>
        <p class="empty-subtext">
          {{ activeTab === 'tasks' ? 'Selesaikan beberapa tugas untuk melihat statistik' : 
             activeTab === 'habits' ? 'Catat kebiasaan Anda untuk melihat perkembangan' : 
             'Lakukan sesi fokus untuk melihat statistik' }}
        </p>
      </div>
      
      <!-- Chart Container with explicit dimensions -->
      <div 
        v-else
        class="chart-area" 
        ref="chartContainer" 
        v-show="!loading && !error"
      >
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(79, 70, 229, 0.3);
  border-radius: 50%;
  border-top-color: rgba(79, 70, 229, 1);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #ef4444;
}

.empty-data-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-subtext {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.5rem;
}

.chart-tabs {
  display: flex;
  border-bottom: 1px solid #334155;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.tab-button {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-button:hover {
  color: #cbd5e1;
}

.tab-button.active {
  color: #818cf8;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #818cf8;
}

.chart-area {
  height: 300px;
  width: 100%;
  position: relative;
}

.chart-area canvas {
  width: 100% !important;
  height: 100% !important;
}

@media (min-width: 1024px) {
  .chart-container {
    height: 420px;
    max-height: 420px;
  }
  
  .chart-area, .empty-data-message {
    height: 320px;
  }
}

@media (min-width: 1280px) {
  .chart-container {
    height: 450px;
    max-height: 450px;
  }
  
  .chart-area, .empty-data-message {
    height: 350px;
  }
}
</style> 