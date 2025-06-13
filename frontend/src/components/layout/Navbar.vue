<template>
  <nav class="navbar" :class="{ 'auth-navbar': isAuthPage, 'static-navbar': isStaticPage || isLandingPage }">
    <div class="navbar-container">
      <div class="navbar-logo">
        <router-link to="/" class="logo-link" @click="scrollToTop">
          <span class="logo-text">FANB</span>
        </router-link>
      </div>
      
      <div class="navbar-menu" v-if="!isMobileView">
        <!-- Landing Page Navbar -->
        <template v-if="isLandingPage">
          <router-link to="/features" class="nav-link" @click="scrollToTop">Fitur</router-link>
          <router-link to="/faq" class="nav-link" @click="scrollToTop">FAQ</router-link>
          <router-link to="/blog" class="nav-link" @click="scrollToTop">Blog</router-link>
          <router-link to="/about" class="nav-link" @click="scrollToTop">Tentang Kami</router-link>
          <router-link to="/contact" class="nav-link" @click="scrollToTop">Hubungi Kami</router-link>
        </template>
        
        <!-- Static Page Navbar -->
        <template v-else-if="isStaticPage">
          <router-link to="/" class="nav-link" @click="scrollToTop">Beranda</router-link>
          <router-link to="/features" class="nav-link" @click="scrollToTop">Fitur</router-link>
          <router-link to="/security" class="nav-link" @click="scrollToTop">Keamanan</router-link>
          <router-link to="/faq" class="nav-link" @click="scrollToTop">FAQ</router-link>
          <router-link to="/blog" class="nav-link" @click="scrollToTop">Blog</router-link>
          <router-link to="/about" class="nav-link" @click="scrollToTop">Tentang Kami</router-link>
          <router-link to="/careers" class="nav-link" @click="scrollToTop">Karier</router-link>
          <router-link to="/contact" class="nav-link" @click="scrollToTop">Hubungi Kami</router-link>
        </template>
        
        <!-- Legal Page Navbar -->
        <template v-else-if="isLegalPage">
          <router-link to="/" class="nav-link" @click="scrollToTop">Beranda</router-link>
          <router-link to="/terms" class="nav-link" @click="scrollToTop">Ketentuan Layanan</router-link>
          <router-link to="/privacy" class="nav-link" @click="scrollToTop">Kebijakan Privasi</router-link>
          <router-link to="/cookies" class="nav-link" @click="scrollToTop">Kebijakan Cookies</router-link>
        </template>
        
        <!-- AI Assistant Page Navbar -->
        <template v-else-if="isAIAssistantPage">
          <router-link to="/" class="nav-link" @click="scrollToTop">Beranda</router-link>
          <div class="status-indicator" :class="{ 'connected': aiConnected }">
            <span class="status-dot"></span>
            <span class="status-text">{{ aiConnected ? 'Terhubung' : 'Tidak Terhubung' }}</span>
          </div>
        </template>
        
        <!-- Auth Page Navbar -->
        <template v-else-if="isAuthPage">
          <router-link to="/" class="nav-link" @click="scrollToTop">Kembali ke Beranda</router-link>
        </template>
        
        <!-- Error/Maintenance Page Navbar -->
        <template v-else-if="isErrorPage">
          <router-link to="/" class="nav-link" @click="scrollToTop">Kembali ke Beranda</router-link>
          <router-link to="/contact" class="nav-link" @click="scrollToTop">Hubungi Dukungan</router-link>
        </template>
      </div>
      
      <!-- Mobile Menu Toggle -->
      <button class="mobile-toggle" v-if="isMobileView" @click="toggleMobileMenu">
        <span class="menu-icon"></span>
      </button>
      
      <!-- Actions Section -->
      <div class="navbar-actions">
        <!-- AI Assistant Actions -->
        <template v-if="isAIAssistantPage">
          <button class="btn btn-outline" @click="resetConversation">
            <span>Reset Percakapan</span>
          </button>
          <button class="btn btn-outline" @click="toggleAISettings">
            <span>Pengaturan AI</span>
          </button>
        </template>
        
        <!-- User Menu for Logged In Users -->
        <template v-if="isLoggedIn">
          <div class="user-menu" @click="toggleUserMenu" ref="userMenuRef">
            <div class="user-avatar">
              <img 
                v-if="user?.profile?.avatar" 
                :src="user.profile.avatar" 
                alt="User avatar" 
                @error="handleAvatarError" 
                v-show="!avatarError" 
              />
              <div v-if="!user?.profile?.avatar || avatarError" class="avatar-placeholder">
                {{ userInitials }}
              </div>
            </div>
            <span class="user-name">{{ user?.profile?.firstName || 'User' }}</span>
            <span class="dropdown-icon">▼</span>
            
            <div v-if="showUserMenu" class="user-dropdown">
              <router-link to="/dashboard" class="dropdown-item">
                <span class="item-icon">📊</span>
                <span>Dashboard</span>
              </router-link>
              <router-link to="/profile" class="dropdown-item">
                <span class="item-icon">👤</span>
                <span>Profil</span>
              </router-link>
              <router-link to="/settings" class="dropdown-item">
                <span class="item-icon">⚙️</span>
                <span>Pengaturan</span>
              </router-link>
              <div class="dropdown-divider"></div>
              <button @click="handleLogout" class="dropdown-item logout-button">
                <span class="item-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </template>
        
        <!-- Login/Register for visitors -->
        <template v-else-if="!isAuthPage">
          <router-link to="/login" class="btn btn-outline">Masuk</router-link>
          <router-link to="/register" class="btn btn-primary">Daftar</router-link>
        </template>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div class="mobile-menu" v-if="showMobileMenu">
      <div class="mobile-menu-content">
        <!-- Landing Page Mobile Menu -->
        <template v-if="isLandingPage">
          <router-link to="/features" class="mobile-nav-link" @click="closeMobileMenu">Fitur</router-link>
          <router-link to="/faq" class="mobile-nav-link" @click="closeMobileMenu">FAQ</router-link>
          <router-link to="/blog" class="mobile-nav-link" @click="closeMobileMenu">Blog</router-link>
          <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">Tentang Kami</router-link>
          <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu">Hubungi Kami</router-link>
        </template>
        
        <!-- Static Page Mobile Menu -->
        <template v-else-if="isStaticPage">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Beranda</router-link>
          <router-link to="/features" class="mobile-nav-link" @click="closeMobileMenu">Fitur</router-link>
          <router-link to="/security" class="mobile-nav-link" @click="closeMobileMenu">Keamanan</router-link>
          <router-link to="/faq" class="mobile-nav-link" @click="closeMobileMenu">FAQ</router-link>
          <router-link to="/blog" class="mobile-nav-link" @click="closeMobileMenu">Blog</router-link>
          <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">Tentang Kami</router-link>
          <router-link to="/careers" class="mobile-nav-link" @click="closeMobileMenu">Karier</router-link>
          <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu">Hubungi Kami</router-link>
        </template>
        
        <!-- Legal Page Mobile Menu -->
        <template v-else-if="isLegalPage">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Beranda</router-link>
          <router-link to="/terms" class="mobile-nav-link" @click="closeMobileMenu">Ketentuan Layanan</router-link>
          <router-link to="/privacy" class="mobile-nav-link" @click="closeMobileMenu">Kebijakan Privasi</router-link>
          <router-link to="/cookies" class="mobile-nav-link" @click="closeMobileMenu">Kebijakan Cookies</router-link>
        </template>
        
        <!-- AI Assistant Page Mobile Menu -->
        <template v-else-if="isAIAssistantPage">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Beranda</router-link>
          <div class="status-indicator mobile" :class="{ 'connected': aiConnected }">
            <span class="status-dot"></span>
            <span class="status-text">{{ aiConnected ? 'Terhubung' : 'Tidak Terhubung' }}</span>
          </div>
          <button class="mobile-nav-button" @click="resetConversation">Reset Percakapan</button>
          <button class="mobile-nav-button" @click="toggleAISettings">Pengaturan AI</button>
        </template>
        
        <!-- Auth Page Mobile Menu -->
        <template v-else-if="isAuthPage">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Kembali ke Beranda</router-link>
        </template>
        
        <!-- Error/Maintenance Page Mobile Menu -->
        <template v-else-if="isErrorPage">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Kembali ke Beranda</router-link>
          <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu">Hubungi Dukungan</router-link>
        </template>
        
        <!-- Auth Actions for Mobile -->
        <div class="mobile-auth-actions" v-if="!isLoggedIn && !isAuthPage">
          <router-link to="/login" class="btn btn-outline full-width" @click="closeMobileMenu">Masuk</router-link>
          <router-link to="/register" class="btn btn-primary full-width" @click="closeMobileMenu">Daftar</router-link>
        </div>

        <!-- User Menu for Logged In Users (Mobile) -->
        <div class="mobile-user-menu" v-if="isLoggedIn && !isAuthPage && !isAIAssistantPage && !isErrorPage">
          <div class="mobile-user-header">
            <div class="avatar-placeholder mobile" v-if="!user?.profile?.avatar || avatarError">
              {{ userInitials }}
            </div>
            <img 
              v-if="user?.profile?.avatar" 
              :src="user.profile.avatar" 
              alt="User avatar" 
              @error="handleAvatarError" 
              v-show="!avatarError"
              class="mobile-user-avatar" 
            />
            <span class="mobile-user-name">{{ user?.profile?.firstName || 'User' }}</span>
          </div>
          <router-link to="/dashboard" class="mobile-nav-link" @click="closeMobileMenu">
            <span class="mobile-item-icon">📊</span>
            <span>Dashboard</span>
          </router-link>
          <router-link to="/profile" class="mobile-nav-link" @click="closeMobileMenu">
            <span class="mobile-item-icon">👤</span>
            <span>Profil</span>
          </router-link>
          <router-link to="/settings" class="mobile-nav-link" @click="closeMobileMenu">
            <span class="mobile-item-icon">⚙️</span>
            <span>Pengaturan</span>
          </router-link>
          <button @click="handleLogout" class="mobile-nav-button logout-mobile">
            <span class="mobile-item-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '../../store/auth';
import { useRoute } from 'vue-router';

const route = useRoute();
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const user = computed(() => authStore.user);

// Deteksi tipe halaman
const isLandingPage = computed(() => route.name === 'landing');
const isStaticPage = computed(() => {
  const staticPages = ['features', 'security', 'faq', 
                      'blog', 'about', 'careers', 'contact'];
  return staticPages.includes(route.name as string);
});
const isLegalPage = computed(() => {
  const legalPages = ['terms', 'privacy', 'cookies'];
  return legalPages.includes(route.name as string);
});
const isAuthPage = computed(() => {
  const authPages = ['login', 'register', 'forgot-password'];
  return authPages.includes(route.name as string);
});
const isAIAssistantPage = computed(() => route.name === 'ai-assistant');
const isErrorPage = computed(() => {
  const errorPages = ['not-found', 'maintenance'];
  return errorPages.includes(route.name as string);
});

// User initials
const userInitials = computed(() => {
  if (!user.value?.profile) return '?';
  
  const firstName = user.value.profile.firstName || '';
  const lastName = user.value.profile.lastName || '';
  
  return (firstName.charAt(0) + (lastName.charAt(0) || '')).toUpperCase();
});

// User menu dropdown
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false;
  }
};

// Mobile responsiveness
const isMobileView = ref(false);
const showMobileMenu = ref(false);

const checkMobileView = () => {
  isMobileView.value = window.innerWidth < 1024;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

// AI Assistant features
const aiConnected = ref(true); // Status koneksi AI

const resetConversation = () => {
  // Implementasi reset percakapan AI
  console.log('Reset percakapan AI');
};

const toggleAISettings = () => {
  // Implementasi toggle pengaturan AI
  console.log('Toggle pengaturan AI');
};

// Avatar error handling
const avatarError = ref(false);

const handleAvatarError = () => {
  console.log('Avatar failed to load, using placeholder');
  avatarError.value = true;
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', closeUserMenu);
  window.addEventListener('resize', checkMobileView);
  checkMobileView();
});

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu);
  window.removeEventListener('resize', checkMobileView);
});

// Route change
watch(
  () => route.name,
  () => {
    closeMobileMenu();
  }
);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

const handleLogout = async () => {
  await authStore.logout();
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--navbar-bg, rgba(11, 16, 30, 0.8));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding: 0.75rem 0;
}

/* Navbar untuk halaman autentikasi */
.auth-navbar {
  background: transparent !important;
  backdrop-filter: none;
  border-bottom: none;
}

/* Navbar untuk halaman static dan landing */
.static-navbar {
  background: var(--surface-1) !important;
  backdrop-filter: blur(16px);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 1.5rem;
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.2s;
  text-decoration: none;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-outline {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.btn-outline:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

/* Status indikator untuk AI Assistant */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.875rem;
}

.status-indicator.connected .status-dot {
  background: var(--toast-success); /* Hijau */
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--toast-error); /* Merah */
}

.status-text {
  color: var(--text-secondary);
}

/* User menu */
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.user-menu:hover {
  background: rgba(255, 255, 255, 0.05);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
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
  font-size: 0.875rem;
}

.user-name {
  font-weight: 500;
}

.dropdown-icon {
  font-size: 0.625rem;
  color: var(--text-secondary);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 200px;
  background: var(--surface-1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: background 0.2s;
  cursor: pointer;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.item-icon {
  font-size: 1rem;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.25rem 0;
}

.logout-button {
  color: var(--accent);
}

/* Mobile styles */
.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  cursor: pointer;
  position: relative;
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
  display: block;
  background-color: var(--text-primary);
  position: absolute;
  height: 2px;
  width: 1.5rem;
  transition: transform 0.2s;
}

.menu-icon::before {
  content: '';
  margin-top: -8px;
}

.menu-icon::after {
  content: '';
  margin-top: 8px;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 4rem;
  left: 0;
  width: 100%;
  height: calc(100vh - 4rem);
  background: var(--surface-1);
  z-index: 999;
  overflow-y: auto;
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.mobile-nav-link {
  color: var(--text-primary);
  font-weight: 500;
  padding: 1rem;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-nav-button {
  color: var(--text-primary);
  font-weight: 500;
  padding: 1rem;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-left: none;
  border-right: none;
  border-top: none;
}

.status-indicator.mobile {
  margin: 1rem;
  justify-content: center;
}

.mobile-auth-actions {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.full-width {
  width: 100%;
  margin-top: 0.5rem;
}

@media (max-width: 1023px) {
  .navbar-menu {
    display: none;
  }
  
  .mobile-toggle {
    display: block;
  }
  
  .mobile-menu {
    display: block;
  }
}

.forgot-password {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Mobile User Menu */
.mobile-user-menu {
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.mobile-user-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
}

.avatar-placeholder.mobile {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
}

.mobile-user-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.mobile-item-icon {
  width: 1.5rem;
  margin-right: 0.5rem;
  text-align: center;
  display: inline-block;
}

.logout-mobile {
  color: var(--accent);
}

.mobile-user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}
</style>
