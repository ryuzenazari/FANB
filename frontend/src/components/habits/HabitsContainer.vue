<template>
  <div class="habits-container">
    <!-- Habit Modal -->
    <HabitModal
      :is-open="isModalOpen"
      :mode="modalMode"
      :habit="selectedHabit"
      @close="closeModal"
      @update="handleHabitUpdate"
    />
    
    <!-- Slot untuk menampilkan konten lain -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, onMounted, onUnmounted } from 'vue';
import { useHabitStore } from '../../store/habit';
import HabitModal from './HabitModal.vue';

// Store
const habitStore = useHabitStore();

// State
const isModalOpen = ref(false);
const modalMode = ref<'add' | 'edit'>('add');
const selectedHabit = ref<any>(null);

// Methods
const openHabitModal = (mode: 'add' | 'edit', habit: any = null) => {
  console.log(`Opening habit modal in ${mode} mode`, habit);
  modalMode.value = mode;
  selectedHabit.value = habit;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedHabit.value = null;
  }, 300);
};

const handleHabitUpdate = async () => {
  try {
    await habitStore.fetchHabits();
  } catch (error) {
    console.error('Error fetching habits after update:', error);
  }
};

// Event listeners for global events
const handleOpenNewHabit = () => {
  openHabitModal('add');
};

const handleOpenEditHabit = (event: CustomEvent) => {
  const habit = event.detail;
  openHabitModal('edit', habit);
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('open-new-habit-form', handleOpenNewHabit);
  window.addEventListener('open-edit-habit-form', handleOpenEditHabit as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('open-new-habit-form', handleOpenNewHabit);
  window.removeEventListener('open-edit-habit-form', handleOpenEditHabit as EventListener);
});

// Expose methods to parent components
defineExpose({
  openHabitModal
});
</script>

<style scoped>
.habits-container {
  /* No specific styling needed, just a wrapper */
}
</style> 