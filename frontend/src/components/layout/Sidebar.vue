<template>
  <aside :class="['sidebar', {'sidebar-collapsed': isCollapsed}]">
    <div class="sidebar-header">
      <div class="app-logo">
        <span class="logo-icon">F</span>
        <span class="logo-text" v-show="!isCollapsed">FANB</span>
      </div>
      <button class="collapse-btn" @click="toggleCollapse">
        <span class="collapse-icon">{{ isCollapsed ? '→' : '←' }}</span>
      </button>
    </div>

    <div class="user-profile" v-if="authStore.user">
      <div class="user-avatar">
        <img 
          v-if="authStore.user?.profile?.avatar" 
          :src="authStore.user.profile.avatar" 
          alt="User avatar" 
          @error="handleAvatarError" 
          v-show="!avatarError" 
        />
        <div v-if="!authStore.user?.profile?.avatar || avatarError" class="avatar-placeholder">
          {{ userInitials }}
        </div>
      </div>
      <div class="user-info" v-show="!isCollapsed">
        <h3 class="user-name">{{ authStore.user?.profile?.firstName || 'Pengguna' }}</h3>
        <p class="user-email">{{ authStore.user?.email || '' }}</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link" :class="{ 'active': $route.path === '/dashboard' }">
            <span class="nav-icon">📊</span>
            <span class="nav-text" v-show="!isCollapsed">Dashboard</span>
            <div class="tooltip" v-if="isCollapsed">Dashboard</div>
          </router-link>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link direct-nav"
            @click="navigateTo('/tasks')"
            :class="{ 'active': $route.path.includes('/tasks') }"
          >
            <span class="nav-icon">📝</span>
            <span class="nav-text" v-show="!isCollapsed">Tugas</span>
            <div class="tooltip" v-if="isCollapsed">Tugas</div>
          </button>
        </li>
        <li class="nav-item" v-if="$route.path.includes('/tasks')">
          <button 
            class="nav-link direct-nav"
            @click="$emit('open-task-form')"
          >
            <span class="nav-icon">➕</span>
            <span class="nav-text" v-show="!isCollapsed">Tambah Tugas</span>
            <div class="tooltip" v-if="isCollapsed">Tambah Tugas</div>
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link direct-nav"
            @click="navigateTo('/habits')"
            :class="{ 'active': $route.path.includes('/habits') }"
          >
            <span class="nav-icon">🔄</span>
            <span class="nav-text" v-show="!isCollapsed">Kebiasaan</span>
            <div class="tooltip" v-if="isCollapsed">Kebiasaan</div>
          </button>
        </li>
        <li class="nav-item" v-if="$route.path.includes('/habits')">
          <button 
            class="nav-link direct-nav"
            @click="$emit('open-habit-form')"
          >
            <span class="nav-icon">➕</span>
            <span class="nav-text" v-show="!isCollapsed">Tambah Kebiasaan</span>
            <div class="tooltip" v-if="isCollapsed">Tambah Kebiasaan</div>
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link direct-nav"
            @click="navigateToFocus()"
            :class="{ 'active': $route.path === '/focus' }"
          >
            <span class="nav-icon">⏱️</span>
            <span class="nav-text" v-show="!isCollapsed">Mode Fokus</span>
            <div class="tooltip" v-if="isCollapsed">Mode Fokus</div>
          </button>
        </li>
        <li class="nav-item">
          <router-link to="/calendar" class="nav-link" :class="{ 'active': $route.path === '/calendar' }">
            <span class="nav-icon">📅</span>
            <span class="nav-text" v-show="!isCollapsed">Kalender</span>
            <div class="tooltip" v-if="isCollapsed">Kalender</div>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/ai-assistant" class="nav-link" :class="{ 'active': $route.path === '/ai-assistant' }">
            <span class="nav-icon">🤖</span>
            <span class="nav-text" v-show="!isCollapsed">Asisten AI</span>
            <div class="tooltip" v-if="isCollapsed">Asisten AI</div>
          </router-link>
        </li>
      </ul>

      <div class="sidebar-divider" v-show="!isCollapsed">
        <span>Pengaturan</span>
      </div>

      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link" :class="{ 'active': $route.path === '/profile' }">
            <span class="nav-icon">👤</span>
            <span class="nav-text" v-show="!isCollapsed">Profil</span>
            <div class="tooltip" v-if="isCollapsed">Profil</div>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/settings" class="nav-link" :class="{ 'active': $route.path === '/settings' }">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text" v-show="!isCollapsed">Pengaturan</span>
            <div class="tooltip" v-if="isCollapsed">Pengaturan</div>
          </router-link>
        </li>
        <li class="nav-item">
          <button @click="handleLogout" class="nav-link logout-link">
            <span class="nav-icon">🚪</span>
            <span class="nav-text" v-show="!isCollapsed">Logout</span>
            <div class="tooltip" v-if="isCollapsed">Logout</div>
          </button>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer" v-show="!isCollapsed">
      <div class="connection-status" :class="{ 'connected': isConnected }">
        <span class="status-dot"></span>
        <span class="status-text">{{ isConnected ? 'Online' : 'Offline' }}</span>
      </div>
      <span class="app-version">v1.0.0</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';

// Define emits 
const emit = defineEmits(['open-task-form', 'open-habit-form']);

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Sidebar state
const isCollapsed = ref(false);
const isConnected = ref(true);
const avatarError = ref(false);

// User initials
const userInitials = computed(() => {
  if (!authStore.user?.profile) return '?';
  
  const firstName = authStore.user.profile.firstName || '';
  const lastName = authStore.user.profile.lastName || '';
  
  return (firstName.charAt(0) + (lastName.charAt(0) || '')).toUpperCase();
});

// Toggle sidebar collapse
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('sidebar-collapsed', isCollapsed.value.toString());
};

// Navigasi langsung ke halaman
const navigateTo = (path: string) => {
  console.log('Direct navigation to:', path);
  console.log('Current route:', router.currentRoute.value.path);
  console.log('Environment mode:', import.meta.env.MODE);
  router.push(path).catch(err => {
    console.error('Navigation error:', err);
  });
};

// Navigasi langsung ke tasks
const navigateToTasks = () => {
  console.log('Navigating to tasks via button');
  router.push('/tasks');
};

// Navigasi langsung ke focus
const navigateToFocus = () => {
  console.log('Navigating to focus via button');
  console.log('Current route:', router.currentRoute.value.path);
  console.log('Environment mode:', import.meta.env.MODE);
  router.push('/focus').catch(err => {
    console.error('Navigation error:', err);
    // Fallback dengan window.location
    window.location.href = '/focus';
  });
};

// Logout handler
const handleLogout = async () => {
  await authStore.logout();
};

// Handle avatar error
const handleAvatarError = () => {
  avatarError.value = true;
};

// Watch route changes to auto-collapse on small screens
watch(
  () => route.name,
  () => {
    if (window.innerWidth < 768) {
      isCollapsed.value = true;
    }
  }
);

// Initialize sidebar state from localStorage on component mount
if (localStorage.getItem('sidebar-collapsed') === 'true') {
  isCollapsed.value = true;
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 4rem; /* Allow space for navbar */
  left: 0;
  width: 240px;
  height: calc(100vh - 4rem);
  background: rgba(17, 25, 40, 0.75);
  backdrop-filter: blur(16px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 100;
  overflow: hidden;
}

.sidebar-collapsed {
  width: 60px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  height: 70px;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 8px;
  color: white;
  font-weight: 800;
  font-size: 1.25rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.collapse-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.collapse-icon {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.user-profile {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.user-info {
  flex: 1;
  overflow: hidden;
}

.user-name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.user-email {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.75rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.nav-link.active {
  background: rgba(84, 105, 255, 0.15);
  color: var(--primary);
}

.nav-link.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 3px;
  background: linear-gradient(to bottom, var(--primary), var(--secondary));
  border-radius: 0 4px 4px 0;
}

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  margin-left: 10px;
  z-index: 10;
}

.tooltip::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  border-style: solid;
  border-width: 5px 5px 5px 0;
  border-color: transparent rgba(0, 0, 0, 0.75) transparent transparent;
}

.nav-link:hover .tooltip {
  opacity: 1;
}

.sidebar-divider {
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  margin: 1rem 0;
}

.sidebar-divider span {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin: 0 0.5rem;
}

.sidebar-divider::before,
.sidebar-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-footer {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--toast-error);
}

.connected .status-dot {
  background-color: var(--toast-success);
}

.app-version {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.logout-link {
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  font-size: inherit;
}

.logout-link:hover {
  color: var(--accent);
}

.direct-nav {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.direct-nav:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.direct-nav.active {
  background: rgba(84, 105, 255, 0.15);
  color: var(--primary);
}

.direct-nav.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 3px;
  background: linear-gradient(to bottom, var(--primary), var(--secondary));
  border-radius: 0 4px 4px 0;
}

@media (max-width: 1024px) {
  .sidebar {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }
}
</style> 