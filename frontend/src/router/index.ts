import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import AIAssistantView from '../views/AIAssistantView.vue'
import TermsOfServiceView from '../views/legal/TermsOfServiceView.vue'
import PrivacyPolicyView from '../views/legal/PrivacyPolicyView.vue'

// Fungsi untuk memeriksa validitas token JWT
const isTokenExpired = (token: string): boolean => {
  try {
    console.log('Validating token:', token ? token.substring(0, 15) + '...' : 'null');
    // Tidak lagi bypass token expiration check di development mode
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) {
      console.warn('Token tidak memiliki payload');
      return true;
    }
    
    try {
      const payload = JSON.parse(atob(payloadBase64));
      console.log('Token payload:', payload);
      
      // Cek apakah token sudah kedaluwarsa
      if (!payload.exp) {
        console.log('Token tidak memiliki exp claim, menganggap valid untuk development');
        return false; // Jika tidak ada exp, anggap valid (untuk development)
      }
      
      const isExpired = payload.exp < Date.now() / 1000;
      console.log('Token expired?', isExpired, 'current time:', Date.now() / 1000, 'exp time:', payload.exp);
      return isExpired;
    } catch (parseError) {
      console.error('Error parsing token payload:', parseError);
      return true;
    }
  } catch (error) {
    console.warn('Invalid token format:', error);
    return true; // Jika format token tidak valid, anggap sudah kedaluwarsa
  }
};

// Fungsi untuk memeriksa apakah user sudah login dengan token valid
const isLoggedInWithValidToken = (): boolean => {
  // Gunakan user-token untuk konsistensi dengan auth store
  const token = localStorage.getItem('user-token');
  if (!token) return false;
  
  return !isTokenExpired(token);
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: LandingView,
    meta: {
      title: 'FANB - Focus and Build',
      guestOnly: false
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard | FANB'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: 'Masuk | FANB',
      layout: 'auth',
      guestOnly: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: {
      title: 'Daftar | FANB',
      layout: 'auth',
      guestOnly: true
    }
  },
  {
    path: '/ai-assistant',
    name: 'ai-assistant',
    component: AIAssistantView,
    meta: {
      requiresAuth: true,
      title: 'Asisten AI | FANB'
    }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../views/CalendarView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Kalender | FANB'
    }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/tasks/TasksView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Tugas | FANB'
    }
  },
  // Route /tasks/new dihapus karena sekarang menggunakan modal
  // {
  //   path: '/tasks/new',
  //   name: 'new-task',
  //   component: () => import('../views/tasks/NewTaskView.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Tugas Baru | FANB'
  //   }
  // },
  {
    path: '/focus',
    name: 'focus',
    component: () => import('../views/focus/FocusView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Fokus | FANB'
    }
  },
  {
    path: '/habits',
    name: 'habits',
    component: () => import('../views/HabitsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Kebiasaan | FANB'
    }
  },
  {
    path: '/habits/new',
    name: 'new-habit',
    component: () => import('../views/NewHabitView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Kebiasaan Baru | FANB'
    }
  },
  {
    path: '/habits/edit/:id',
    name: 'edit-habit',
    component: () => import('../views/EditHabitView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Edit Kebiasaan | FANB'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Profil | FANB'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Pengaturan | FANB'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: {
      title: 'Lupa Password | FANB',
      layout: 'auth',
      guestOnly: true
    }
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: () => import('../views/ResetPasswordView.vue'),
    meta: {
      title: 'Reset Password | FANB',
      layout: 'auth',
      guestOnly: true
    }
  },
  {
    path: '/verify-email/:token',
    name: 'verify-email',
    component: () => import('../views/EmailVerificationView.vue'),
    meta: {
      title: 'Verifikasi Email | FANB',
      layout: 'auth'
    }
  },
  {
    path: '/2fa',
    name: 'two-factor-auth',
    component: () => import('../views/TwoFactorAuthView.vue'),
    meta: {
      title: 'Autentikasi Dua Faktor | FANB',
      layout: 'auth'
    }
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    component: () => import('../views/MaintenanceView.vue')
  },
  // Halaman static (footer)
  {
    path: '/features',
    name: 'features',
    component: () => import('../views/static/FeaturesView.vue'),
    meta: {
      title: 'Fitur | FANB'
    }
  },
  {
    path: '/security',
    name: 'security',
    component: () => import('../views/static/SecurityView.vue'),
    meta: {
      title: 'Keamanan | FANB'
    }
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('../views/static/FAQView.vue'),
    meta: {
      title: 'FAQ | FANB'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/static/AboutView.vue'),
    meta: {
      title: 'Tentang Kami | FANB'
    }
  },
  {
    path: '/careers',
    name: 'careers',
    component: () => import('../views/static/CareersView.vue'),
    meta: {
      title: 'Karier | FANB'
    }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/static/BlogView.vue'),
    meta: {
      title: 'Blog | FANB'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/static/ContactView.vue'),
    meta: {
      title: 'Hubungi Kami | FANB'
    }
  },
  // Halaman legal
  {
    path: '/terms',
    name: 'terms',
    component: TermsOfServiceView,
    meta: { guestOnly: false }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyPolicyView,
    meta: { guestOnly: false }
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: () => import('../views/static/CookiesView.vue'),
    meta: {
      title: 'Kebijakan Cookies | FANB'
    }
  },
  {
    path: '/auth/callback',
    name: 'oauth-callback',
    component: () => import('../views/auth/OAuthCallback.vue'),
    meta: {
      title: 'Autentikasi | FANB',
      layout: 'auth'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: 'Halaman Tidak Ditemukan | FANB'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

// Navigation guard untuk halaman yang memerlukan autentikasi
router.beforeEach((to, _from, next) => {
  // Set document title berdasarkan meta title
  const title = to.meta.title || 'FANB App';
  document.title = title as string;
  
  console.log('Navigating to:', to.path);
  console.log('Authentication required:', to.matched.some(record => record.meta.requiresAuth));
  console.log('Is authenticated:', isLoggedInWithValidToken());
  
  // Cek apakah halaman memerlukan autentikasi
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestOnly = to.matched.some(record => record.meta.guestOnly);
  
  // Cek apakah user login dengan token valid
  const isValidSession = isLoggedInWithValidToken();
  console.log('Token valid:', isValidSession);
  
  // Jika navigasi ke dashboard dan sudah login, izinkan
  if (to.name === 'dashboard' && isValidSession) {
    console.log('Navigating to dashboard with valid session');
    return next();
  }
  
  if (requiresAuth && !isValidSession) {
    // Jika halaman memerlukan auth tapi user tidak login atau token tidak valid
    // Hapus token tidak valid jika ada
    if (localStorage.getItem('user-token') && !isValidSession) {
      console.log('Menghapus token tidak valid');
      localStorage.removeItem('user-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('user');
      localStorage.removeItem('2fa_verified');
    }
    
    console.log('Redirecting to login page');
    next({ 
      name: 'login', 
      query: { redirect: to.fullPath } // Simpan target URL untuk redirect setelah login
    });
  } else if (isGuestOnly && isValidSession) {
    // Jika halaman hanya untuk guest (seperti login/register) tapi user sudah login dengan token valid
    console.log('User sudah login, redirect ke dashboard');
    next({ name: 'dashboard' });
  } else {
    // Cek apakah perlu verifikasi 2FA
    const requires2FA = to.matched.some(record => record.meta.requires2FA);
    const is2FAVerified = localStorage.getItem('2fa_verified') === 'true';
    
    if (requires2FA && isValidSession && !is2FAVerified) {
      // Jika halaman memerlukan verifikasi 2FA
      next({ 
        name: 'two-factor-auth',
        query: { 
          verify: 'true',
          redirect: to.fullPath
        }
      });
    } else {
      // Lanjutkan navigasi
      console.log('Navigation allowed to:', to.path);
      next();
    }
  }
});

export default router 