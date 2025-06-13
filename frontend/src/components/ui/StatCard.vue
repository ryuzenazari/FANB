<template>
  <div class="stat-card">
    <div class="stat-content">
      <div class="stat-info">
        <h3 class="stat-title">{{ title }}</h3>
        <div class="stat-value-wrapper">
          <span class="stat-value">{{ value }}</span>
          <span v-if="trend" class="stat-trend" :class="getTrendColor">
            {{ trend }}
          </span>
        </div>
      </div>
      <div class="stat-icon" :class="getIconClass">
        <span v-if="icon === 'check-circle'">✓</span>
        <span v-else-if="icon === 'clock'">⏰</span>
        <span v-else-if="icon === 'fire'">🔥</span>
        <span v-else-if="icon === 'brain'">🧠</span>
        <span v-else>{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: number | string;
  icon?: string;
  color?: string;
  trend?: string;
}>();

// Default prop values
const color = props.color || 'primary';

// Determine trend color based on first character
const getTrendColor = computed(() => {
  if (!props.trend) return '';
  
  if (props.trend.startsWith('+')) {
    return 'trend-positive';
  } else if (props.trend.startsWith('-')) {
    return 'trend-negative';
  }
  
  return 'trend-neutral';
});

const getIconClass = computed(() => {
  return `icon-${props.color || 'primary'}`;
});
</script>

<style scoped>
.stat-card {
  background-color: #1e293b;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #334155;
  padding: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.stat-value-wrapper {
  display: flex;
  align-items: baseline;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
}

.stat-trend {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.trend-positive {
  color: #10b981;
}

.trend-negative {
  color: #ef4444;
}

.trend-neutral {
  color: #94a3b8;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  font-size: 1.2rem;
}

.icon-emerald {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.icon-amber {
  background-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.icon-rose {
  background-color: rgba(225, 29, 72, 0.2);
  color: #e11d48;
}

.icon-indigo {
  background-color: rgba(79, 70, 229, 0.2);
  color: #4f46e5;
}

.icon-primary {
  background-color: rgba(79, 70, 229, 0.2);
  color: #818cf8;
}
</style> 