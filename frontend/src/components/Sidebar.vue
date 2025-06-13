<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>FANB App</h2>
      <p v-if="isLoggedIn">Halo, {{ username }}</p>
    </div>
    
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item" active-class="active">
        <span class="icon">🏠</span>
        <span class="text">Dashboard</span>
      </router-link>
      
      <router-link to="/tasks" class="nav-item" active-class="active">
        <span class="icon">✓</span>
        <span class="text">Tugas</span>
      </router-link>
      
      <router-link to="/habits" class="nav-item" active-class="active">
        <span class="icon">🔄</span>
        <span class="text">Kebiasaan</span>
      </router-link>
      
      <router-link to="/calendar" class="nav-item" active-class="active">
        <span class="icon">📅</span>
        <span class="text">Kalender</span>
      </router-link>
    </nav>
    
    <div class="sidebar-actions">
      <button
        class="btn-snap-sidebar"
        @click="handleAddTaskClick"
      >
        <span class="icon">+</span>
        <span class="text">Tugas Baru</span>
      </button>
      <button
        class="btn-snap-sidebar"
        @click="handleAddHabitClick"
      >
        <span class="icon">+</span>
        <span class="text">Kebiasaan Baru</span>
      </button>
    </div>
    
    <div class="sidebar-footer">
      <router-link v-if="!isLoggedIn" to="/login" class="nav-item">
        <span class="icon">🔑</span>
        <span class="text">Login</span>
      </router-link>
      
      <router-link v-if="!isLoggedIn" to="/register" class="nav-item">
        <span class="icon">📝</span>
        <span class="text">Register</span>
      </router-link>
      
      <button v-if="isLoggedIn" @click="authStore.logout()" class="nav-item">
        <span class="icon">🚪</span>
        <span class="text">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const emit = defineEmits(['open-task-form', 'open-habit-form']);
const router = useRouter();
const authStore = useAuthStore();

// Computed properties
const isLoggedIn = computed(() => authStore.isLoggedIn);
const username = computed(() => {
  if (authStore.user?.profile) {
    const { firstName, lastName } = authStore.user.profile;
    return firstName + (lastName ? ` ${lastName}` : '');
  }
  return 'User';
});

// Handlers
const handleAddTaskClick = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  emit('open-task-form');
};

const handleAddHabitClick = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  emit('open-habit-form');
};
</script> 