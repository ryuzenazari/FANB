<script setup lang="ts">
interface Insight {
  title: string;
  description: string;
  icon: string;
  type: 'tasks' | 'habits' | 'focus' | 'insights';
}

const props = defineProps<{
  insights: Insight[];
}>();
</script>

<template>
  <div class="insights-container">
    <div class="insights-header">
      <div class="header-icon">
        <span>AI</span>
      </div>
      <h2>Wawasan AI</h2>
    </div>
    
    <div class="insights-list">
      <div 
        v-for="(insight, index) in insights" 
        :key="index"
        class="insight-item"
      >
        <div class="insight-icon" :class="`icon-${insight.type}`">
          {{ insight.icon }}
        </div>
        <div class="insight-content">
          <h3 class="insight-title">{{ insight.title }}</h3>
          <p class="insight-description">{{ insight.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.insights-container {
  background-color: #1e293b;
  border-radius: 0.75rem;
  border: 1px solid #334155;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.insights-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  border-bottom: 1px solid #334155;
  background: linear-gradient(to right, rgba(79, 70, 229, 0.1), rgba(79, 70, 229, 0));
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #4f46e5, #818cf8);
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.insights-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 0;
}

.insights-list {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-gap: 0.75rem;
}

.insight-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: rgba(30, 41, 59, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(51, 65, 85, 0.5);
}

.insight-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

.insight-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  font-size: 1.25rem;
}

.icon-tasks {
  background-color: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.icon-habits {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.icon-focus {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.icon-insights {
  background-color: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 1rem;
  font-weight: 600;
  color: #f8fafc;
  margin: 0 0 0.5rem 0;
}

.insight-description {
  font-size: 0.875rem;
  color: #cbd5e1;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .insights-list {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1023px) {
  .insights-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .insights-list {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1280px) {
  .insights-container {
    min-height: 550px;
  }
}
</style> 