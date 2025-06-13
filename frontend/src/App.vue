<script setup lang="ts">
import { computed, ref, onMounted, watch, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './store/auth';
import Navbar from './components/layout/Navbar.vue';
import Sidebar from './components/layout/Sidebar.vue';
import Footer from './components/layout/Footer.vue';
import Background from './components/layout/Background.vue';
import TasksView from './views/tasks/TasksView.vue';
import HabitsView from './views/HabitsView.vue';
import HabitsContainer from './components/habits/HabitsContainer.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Logika autentikasi - gunakan computed dari auth store
const isLoggedIn = computed(() => authStore.isLoggedIn);

// Fungsi untuk login
const login = (token: string) => {
  localStorage.setItem('user-token', token);
  authStore.$patch({ isAuthenticated: true });
  router.push({ name: 'dashboard' });
  addToast('Selamat datang kembali!', 'success');
};

// Fungsi untuk logout
const logout = () => {
  // Gunakan metode logout dari auth store
  authStore.logout();
  router.push({ name: 'landing' });
  addToast('Anda telah berhasil keluar', 'success');
};

// Ekspos fungsi autentikasi untuk digunakan oleh komponen lain
provide('auth', {
  isLoggedIn,
  login,
  logout
});

// Cek status login dari localStorage saat komponen dimuat
onMounted(() => {
  const token = localStorage.getItem('user-token');
  console.log('App.vue - Token tersedia:', !!token);
  
  // Arahkan pengguna sesuai status login
  handleRouteAccess(route.name as string);
  
  // Listen untuk event logout
  window.addEventListener('logout', () => {
    logout();
  });
});

// Daftar halaman publik (untuk guest)
const publicPages = [
  'landing',
  'features',
  'security',
  'faq',
  'about',
  'careers',
  'blog',
  'contact',
  'terms',
  'privacy',
  'cookies',
];

// Daftar halaman autentikasi (untuk guest)
const authPages = ['login', 'register', 'forgot-password'];

// Daftar halaman yang memerlukan login (untuk user)
const protectedPages = ['dashboard', 'tasks', 'habits', 'focus', 'ai-assistant', 'settings', 'profile', 'calendar'];

// Fungsi untuk menangani akses rute berdasarkan status login
const handleRouteAccess = (routeName: string) => {
  // Hilangkan bypass di mode development
  console.log('Handling route access for:', routeName, 'isLoggedIn:', isLoggedIn.value);
  
  if (!routeName) return;
  
  // Jika user sudah login dan mencoba mengakses halaman publik atau autentikasi,
  // redirect ke dashboard
  if (isLoggedIn.value && (publicPages.includes(routeName) || authPages.includes(routeName))) {
    console.log('User logged in, redirecting to dashboard');
    router.replace({ name: 'dashboard' });
  }
  
  // Jika user belum login dan mencoba mengakses halaman yang memerlukan login,
  // redirect ke halaman login
  if (!isLoggedIn.value && protectedPages.includes(routeName)) {
    console.log('User not logged in, redirecting to login page');
    router.replace({ name: 'login' });
  }
}

// Pantau perubahan rute untuk menerapkan aturan akses
watch(
  () => route.name,
  (newRouteName) => {
    handleRouteAccess(newRouteName as string);
  }
);

// Watch status login untuk menerapkan aturan akses jika berubah
watch(
  () => isLoggedIn.value,
  () => {
    handleRouteAccess(route.name as string);
  }
);

// Toast system
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}

const toasts = ref<Toast[]>([]);
let nextToastId = 0;

const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
  const id = nextToastId++;
  const newToast = {
    id,
    message,
    type,
    visible: true
  };
  toasts.value.push(newToast);
  
  // Auto dismiss after 5 seconds
  setTimeout(() => {
    dismissToast(id);
  }, 5000);
};

const dismissToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index !== -1) {
    toasts.value[index].visible = false;
    
    // Remove from DOM after animation
    setTimeout(() => {
      toasts.value = toasts.value.filter(toast => toast.id !== id);
    }, 300);
  }
};

// Listen for custom toast events
onMounted(() => {
  window.addEventListener('show-toast', ((event: CustomEvent) => {
    const { message, type } = event.detail;
    addToast(message, type);
  }) as EventListener);
});

// Computed untuk halaman autentikasi
const isAuthPage = computed(() => {
  return authPages.includes(route.name as string);
});

// Halaman static yang memerlukan background elements
const staticPages = [
  ...publicPages,
  ...authPages,
  'not-found'
];
const isStaticPage = computed(() => {
  return staticPages.includes(route.name as string);
});

// Halaman yang tidak menampilkan footer
const noFooterPages = [
  'login', 
  'register', 
  'forgot-password', 
  'not-found', 
  'maintenance', 
  'ai-assistant',
  'dashboard',
  'tasks',
  'habits',
  'focus',
  'settings',
  'profile',
  'calendar'
];
const showFooter = computed(() => {
  return !noFooterPages.includes(route.name as string);
});

// Navbar ditampilkan di semua halaman
const excludedFromNavbar = [''];
const showNavbar = computed(() => {
  return !excludedFromNavbar.includes(route.name as string);
});

// Halaman yang memerlukan sidebar (halaman utama aplikasi)
const sidebarPages = protectedPages;
const showSidebar = computed(() => {
  return sidebarPages.includes(route.name as string);
});

// Tentukan kelas container berdasarkan halaman
const containerClass = computed(() => {
  const classes = ['app-container'];
  
  // Tambahkan padding-top untuk halaman dengan navbar (kecuali landing)
  if (showNavbar.value && route.name !== 'landing') {
    classes.push('with-navbar');
  }
  
  // Tambahkan kelas untuk halaman dengan sidebar
  if (showSidebar.value) {
    classes.push('with-sidebar');
  }
  
  // Tambahkan kelas spesifik untuk landing page
  if (route.name === 'landing') {
    classes.push('landing-container');
  }
  
  // Tambahkan kelas spesifik untuk halaman auth
  if (isAuthPage.value) {
    classes.push('auth-container');
  }
  
  return classes;
});

// Reference untuk TasksView, HabitsView, dan HabitsContainer
const tasksViewRef = ref<{ openTaskModal: (mode: 'add' | 'edit', task?: any) => void } | null>(null);
const habitsViewRef = ref<{ handleOpenNewHabit: () => void } | null>(null);
const habitsContainerRef = ref<{ openHabitModal: (mode: 'add' | 'edit', habit?: any) => void } | null>(null);

// Event untuk membuka form task baru dari sidebar
const openNewTaskForm = () => {
  console.log('Opening task form from App.vue', new Date().toISOString());
  
  // Cek apakah user sudah login
  if (!isLoggedIn.value) {
    console.log('User not logged in, redirecting to login page');
    router.push('/login');
    return;
  }
  
  // Debug DOM untuk memastikan TasksView ada
  const tasksView = document.querySelector('.tasks-view');
  console.log('TasksView found in DOM:', !!tasksView);
  
  // Memicu event global untuk membuka form task baru
  window.dispatchEvent(new CustomEvent('open-new-task-form'));
  
  // Sebagai fallback jika event tidak bekerja
  setTimeout(() => {
    console.log('Checking if task modal was opened');
    if (tasksViewRef.value && typeof tasksViewRef.value.openTaskModal === 'function') {
      console.log('Directly calling openTaskModal on TasksView ref');
      tasksViewRef.value.openTaskModal('add');
    } else {
      console.log('TasksView reference or method not available');
    }
  }, 100);
};

// Event untuk membuka form habit baru dari sidebar
const openNewHabitForm = () => {
  console.log('Opening habit form from App.vue', new Date().toISOString());
  
  // Cek apakah user sudah login
  if (!isLoggedIn.value) {
    console.log('User not logged in, redirecting to login page');
    router.push('/login');
    return;
  }
  
  // Memicu event global untuk membuka form habit baru
  window.dispatchEvent(new CustomEvent('open-new-habit-form'));
  
  // Sebagai fallback jika event tidak bekerja
  setTimeout(() => {
    console.log('Checking if habit modal was opened');
    if (habitsContainerRef.value && typeof habitsContainerRef.value.openHabitModal === 'function') {
      console.log('Directly calling openHabitModal on HabitsContainer ref');
      habitsContainerRef.value.openHabitModal('add');
    } else if (habitsViewRef.value && typeof habitsViewRef.value.handleOpenNewHabit === 'function') {
      console.log('Directly calling handleOpenNewHabit on HabitsView ref (fallback)');
      habitsViewRef.value.handleOpenNewHabit();
    } else {
      console.log('HabitsContainer and HabitsView references or methods not available');
    }
  }, 100);
};
</script>

<template>
  <!-- Navbar ditampilkan di semua halaman dengan variasi sesuai jenis halaman -->
  <Navbar v-if="showNavbar" :is-logged-in="isLoggedIn" />
  
  <!-- Sidebar ditampilkan hanya di halaman utama aplikasi -->
  <Sidebar v-if="showSidebar" @open-task-form="openNewTaskForm" @open-habit-form="openNewHabitForm" />
  
  <!-- Task modal dan Habit modal untuk handle semua task dan habit di aplikasi -->
  <TasksView v-if="isLoggedIn" ref="tasksViewRef" style="display:none;" />
  <HabitsContainer v-if="isLoggedIn" ref="habitsContainerRef" style="display:none;" />
  <HabitsView v-if="isLoggedIn" ref="habitsViewRef" style="display:none;" />
  
  <!-- Semua halaman menampilkan konten dengan routing yang sama -->
  <div :class="containerClass">
    <Background v-if="isStaticPage" />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component 
          :is="Component" 
          :is-logged-in="isLoggedIn" 
          @open-task-form="openNewTaskForm"
          @open-habit-form="openNewHabitForm"
        />
      </transition>
    </router-view>
    <Footer v-if="showFooter" :is-logged-in="isLoggedIn" />
  </div>

  <!-- Toast container -->
  <div class="toast-container">
    <transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`, { 'toast-visible': toast.visible }]"
        @click="dismissToast(toast.id)"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✓</span>
          <span v-else-if="toast.type === 'error'">✗</span>
          <span v-else-if="toast.type === 'warning'">!</span>
          <span v-else>i</span>
        </div>
        <div class="toast-content">{{ toast.message }}</div>
      </div>
    </transition-group>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --primary: #5469FF;
  --primary-dark: #3E51DB;
  --primary-light: rgba(84, 105, 255, 0.2);
  --secondary: #BD34FE;
  --accent: #FF6B6B;
  --background: #0B101E;
  --surface-1: rgba(30, 41, 59, 0.4);
  --surface-2: rgba(30, 41, 59, 0.7);
  --text-primary: #F9FAFB;
  --text-secondary: #CED3DB;
  --navbar-bg: rgba(11, 16, 30, 0.8);
  
  /* Toast colors */
  --toast-success: #10B981;
  --toast-error: #EF4444;
  --toast-warning: #F59E0B;
  --toast-info: #3B82F6;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--background);
  color: var(--text-primary);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.app-container.with-navbar {
  padding-top: 4rem; /* Adjust based on navbar height */
}

.app-container.with-sidebar {
  padding-left: 240px; /* Adjusted based on sidebar width */
  transition: padding-left 0.3s ease;
  width: 100%;
  max-width: 100%;
  padding-right: 0;
  margin: 0;
}

/* Landing page style */
.landing-container {
  position: relative;
}

/* Auth pages style */
.auth-container {
  position: relative;
}

/* Sidebar collapsed state */
@media (min-width: 1025px) {
  .sidebar.sidebar-collapsed + .app-container.with-sidebar {
    padding-left: 60px;
    width: 100%;
    max-width: 100%;
    padding-right: 0;
    margin: 0;
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .app-container.with-sidebar {
    padding-left: 0;
  }
  
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
}

/* Global transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Toast styling */
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 24rem;
}

.toast {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateX(100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
}

.toast-visible {
  transform: translateX(0);
  opacity: 1;
}

.toast-success {
  background-color: var(--toast-success);
  color: white;
}

.toast-error {
  background-color: var(--toast-error);
  color: white;
}

.toast-warning {
  background-color: var(--toast-warning);
  color: white;
}

.toast-info {
  background-color: var(--toast-info);
  color: white;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  margin-right: 0.75rem;
  font-weight: bold;
}

.toast-content {
  flex-grow: 1;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Priority dropdown styling */
.form-select option {
  background-color: var(--surface-2);
}

.form-select option[value="medium"],
.form-select option[value="sedang"] {
  background-color: rgba(249, 115, 22, 0.2);
  color: #f97316;
}

.form-select option[value="high"],
.form-select option[value="tinggi"] {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.form-select option[value="low"],
.form-select option[value="rendah"] {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.form-select option[value="urgent"],
.form-select option[value="mendesak"] {
  background-color: rgba(236, 72, 153, 0.2);
  color: #ec4899;
}
</style>
