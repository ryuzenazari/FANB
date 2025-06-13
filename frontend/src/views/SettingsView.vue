<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>Pengaturan</h1>
      <p>Kustomisasi pengalaman aplikasi Anda</p>
    </div>
    
    <div class="settings-content">
      <div class="settings-sidebar">
        <div class="settings-nav">
          <button 
            @click="activeTab = 'appearance'" 
            :class="{ active: activeTab === 'appearance' }"
            class="settings-nav-item"
          >
            <span class="nav-icon">🎨</span>
            <span class="nav-text">Tampilan</span>
          </button>
          
          <button 
            @click="activeTab = 'notifications'" 
            :class="{ active: activeTab === 'notifications' }"
            class="settings-nav-item"
          >
            <span class="nav-icon">🔔</span>
            <span class="nav-text">Notifikasi</span>
          </button>
          
          <button 
            @click="activeTab = 'privacy'" 
            :class="{ active: activeTab === 'privacy' }"
            class="settings-nav-item"
          >
            <span class="nav-icon">🔒</span>
            <span class="nav-text">Privasi</span>
          </button>
          
          <button 
            @click="activeTab = 'productivity'" 
            :class="{ active: activeTab === 'productivity' }"
            class="settings-nav-item"
          >
            <span class="nav-icon">⚡</span>
            <span class="nav-text">Produktivitas</span>
          </button>
          
          <button 
            @click="activeTab = 'security'" 
            :class="{ active: activeTab === 'security' }"
            class="settings-nav-item"
          >
            <span class="nav-icon">🛡️</span>
            <span class="nav-text">Keamanan</span>
          </button>
          
          <button 
            @click="activeTab = 'advanced'" 
            :class="{ active: activeTab === 'advanced' }"
            class="settings-nav-item"
          >
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Lanjutan</span>
          </button>
        </div>
      </div>
      
      <div class="settings-main">
        <!-- Appearance Settings -->
        <div v-if="activeTab === 'appearance'" class="settings-tab">
          <h2 class="tab-title">Tampilan</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Tema</h3>
                <p>Pilih tema tampilan untuk aplikasi</p>
              </div>
              
              <div class="setting-control">
                <select v-model="settings.theme" class="form-control">
                  <option value="light">Terang</option>
                  <option value="dark">Gelap</option>
                  <option value="auto">Otomatis (Ikuti Sistem)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notifications Settings -->
        <div v-if="activeTab === 'notifications'" class="settings-tab">
          <h2 class="tab-title">Notifikasi</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Email</h3>
                <p>Terima notifikasi melalui email</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.notifications.email">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Notifikasi Push</h3>
                <p>Terima notifikasi push di browser</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.notifications.push">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Notifikasi Desktop</h3>
                <p>Terima notifikasi di desktop saat aplikasi berjalan</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.notifications.desktop">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Pengingat Tugas</h3>
                <p>Terima pengingat untuk tugas yang akan jatuh tempo</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.notifications.taskReminders">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Pengingat Kebiasaan</h3>
                <p>Terima pengingat untuk kebiasaan harian</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.notifications.habitReminders">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Laporan Mingguan</h3>
                <p>Terima laporan produktivitas mingguan</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.notifications.weeklyReports">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Privacy Settings -->
        <div v-if="activeTab === 'privacy'" class="settings-tab">
          <h2 class="tab-title">Privasi</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Analitik</h3>
                <p>Izinkan pengumpulan data penggunaan anonim untuk meningkatkan aplikasi</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.privacy.analytics">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Berbagi Data</h3>
                <p>Izinkan berbagi data untuk rekomendasi AI yang lebih baik</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.privacy.shareData">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Profil Publik</h3>
                <p>Buat profil Anda dapat dilihat oleh pengguna lain</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.privacy.publicProfile">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Productivity Settings -->
        <div v-if="activeTab === 'productivity'" class="settings-tab">
          <h2 class="tab-title">Produktivitas</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Jam Kerja</h3>
                <p>Atur jam kerja untuk penjadwalan yang lebih baik</p>
              </div>
              
              <div class="setting-control time-control">
                <input 
                  type="time" 
                  v-model="settings.productivity.workingHours.start" 
                  class="form-control time-input"
                />
                <span>hingga</span>
                <input 
                  type="time" 
                  v-model="settings.productivity.workingHours.end" 
                  class="form-control time-input"
                />
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Pelacakan Waktu</h3>
                <p>Lacak waktu yang dihabiskan untuk tugas</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.productivity.timeTracking">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Pengingat Istirahat</h3>
                <p>Dapatkan pengingat untuk beristirahat selama sesi fokus</p>
              </div>
              
              <div class="setting-control">
                <label class="toggle">
                  <input type="checkbox" v-model="settings.productivity.breakReminders">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="settings-tab">
          <h2 class="tab-title">Keamanan</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Ubah Password</h3>
                <p>Perbarui password akun Anda</p>
              </div>
              
              <div class="setting-control">
                <button @click="showChangePasswordModal = true" class="btn-secondary">
                  Ubah Password
                </button>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Otentikasi Dua Faktor</h3>
                <p>Tambahkan lapisan keamanan tambahan ke akun Anda</p>
              </div>
              
              <div class="setting-control">
                <button class="btn-secondary">
                  Atur 2FA
                </button>
              </div>
            </div>
            
            <div class="setting-item danger-zone">
              <div class="setting-info">
                <h3>Hapus Akun</h3>
                <p>Hapus akun dan semua data Anda secara permanen</p>
              </div>
              
              <div class="setting-control">
                <button @click="showDeleteAccountModal = true" class="btn-danger">
                  Hapus Akun
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Advanced Settings -->
        <div v-if="activeTab === 'advanced'" class="settings-tab">
          <h2 class="tab-title">Lanjutan</h2>
          
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Ekspor Data</h3>
                <p>Unduh semua data Anda dalam format JSON</p>
              </div>
              
              <div class="setting-control">
                <button @click="exportData" class="btn-secondary">
                  Ekspor Data
                </button>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Hapus Cache</h3>
                <p>Hapus data cache aplikasi lokal</p>
              </div>
              
              <div class="setting-control">
                <button @click="clearCache" class="btn-secondary">
                  Hapus Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-footer">
      <button @click="resetSettings" class="btn-outline">Reset ke Default</button>
      <button @click="saveSettings" class="btn-primary" :disabled="saving">
        <span v-if="saving">Menyimpan...</span>
        <span v-else>Simpan Perubahan</span>
      </button>
    </div>
    
    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Ubah Password</h2>
          <button @click="showChangePasswordModal = false" class="close-button">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="currentPassword">Password Saat Ini</label>
            <input 
              id="currentPassword" 
              v-model="passwordForm.currentPassword" 
              type="password" 
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="newPassword">Password Baru</label>
            <input 
              id="newPassword" 
              v-model="passwordForm.newPassword" 
              type="password" 
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Konfirmasi Password Baru</label>
            <input 
              id="confirmPassword" 
              v-model="passwordForm.confirmPassword" 
              type="password" 
              class="form-control"
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showChangePasswordModal = false" class="btn-outline">Batal</button>
          <button @click="changePassword" class="btn-primary" :disabled="changingPassword">
            <span v-if="changingPassword">Memproses...</span>
            <span v-else>Ubah Password</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Account Modal -->
    <div v-if="showDeleteAccountModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Hapus Akun</h2>
          <button @click="showDeleteAccountModal = false" class="close-button">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="warning-text">
            Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen.
          </p>
          
          <div class="form-group">
            <label for="deleteConfirmation">Ketik "HAPUS" untuk mengonfirmasi</label>
            <input 
              id="deleteConfirmation" 
              v-model="deleteConfirmation" 
              type="text" 
              class="form-control"
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showDeleteAccountModal = false" class="btn-outline">Batal</button>
          <button 
            @click="deleteAccount" 
            class="btn-danger" 
            :disabled="deleteConfirmation !== 'HAPUS' || deletingAccount"
          >
            <span v-if="deletingAccount">Memproses...</span>
            <span v-else>Hapus Akun Saya</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import axios from '../plugins/axios';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';

// Router & Store
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// User data
const user = computed(() => authStore.user as any);

// Tabs
const activeTab = ref('appearance');

// Loading states
const saving = ref(false);
const changingPassword = ref(false);
const deletingAccount = ref(false);

// Settings data
const settings = reactive({
  theme: 'dark',
  notifications: {
    email: true,
    push: true,
    desktop: false,
    taskReminders: true,
    habitReminders: true,
    weeklyReports: true
  },
  privacy: {
    shareData: false,
    analytics: true,
    publicProfile: false
  },
  productivity: {
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    timeTracking: true,
    breakReminders: true
  }
});

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Delete account
const showDeleteAccountModal = ref(false);
const deleteConfirmation = ref('');

// Change password
const showChangePasswordModal = ref(false);

// Load user settings
const loadSettings = () => {
  if (user.value?.settings) {
    // Theme
    settings.theme = user.value.settings.theme || 'dark';
    
    // Notifications
    if (user.value.settings.notifications) {
      settings.notifications.email = user.value.settings.notifications.email ?? true;
      settings.notifications.push = user.value.settings.notifications.push ?? true;
      settings.notifications.desktop = user.value.settings.notifications.desktop ?? false;
      settings.notifications.taskReminders = user.value.settings.notifications.taskReminders ?? true;
      settings.notifications.habitReminders = user.value.settings.notifications.habitReminders ?? true;
      settings.notifications.weeklyReports = user.value.settings.notifications.weeklyReports ?? true;
    }
    
    // Privacy
    if (user.value.settings.privacy) {
      settings.privacy.shareData = user.value.settings.privacy.shareData ?? false;
      settings.privacy.analytics = user.value.settings.privacy.analytics ?? true;
      settings.privacy.publicProfile = user.value.settings.privacy.publicProfile ?? false;
    }
    
    // Productivity
    if (user.value.settings.productivity) {
      if (user.value.settings.productivity.workingHours) {
        settings.productivity.workingHours.start = user.value.settings.productivity.workingHours.start || '09:00';
        settings.productivity.workingHours.end = user.value.settings.productivity.workingHours.end || '17:00';
      }
      
      settings.productivity.timeTracking = user.value.settings.productivity.timeTracking ?? true;
      settings.productivity.breakReminders = user.value.settings.productivity.breakReminders ?? true;
    }
  }
};

// Save settings
const saveSettings = async () => {
  try {
    saving.value = true;
    
    const response = await axios.put('/api/users/settings', { settings });
    
    if (response.data.success) {
      // Update auth store
      authStore.user = response.data.data.user;
      toast.success('Pengaturan berhasil disimpan');
      
      // Apply theme
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Gagal menyimpan pengaturan');
  } finally {
    saving.value = false;
  }
};

// Reset settings
const resetSettings = () => {
  settings.theme = 'light';
  
  settings.notifications.email = true;
  settings.notifications.push = true;
  settings.notifications.desktop = false;
  settings.notifications.taskReminders = true;
  settings.notifications.habitReminders = true;
  settings.notifications.weeklyReports = true;
  
  settings.privacy.shareData = false;
  settings.privacy.analytics = true;
  settings.privacy.publicProfile = false;
  
  settings.productivity.workingHours.start = '09:00';
  settings.productivity.workingHours.end = '17:00';
  settings.productivity.timeTracking = true;
  settings.productivity.breakReminders = true;
  
  toast.info('Pengaturan direset ke default');
};

// Change password
const changePassword = async () => {
  // Validate passwords
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error('Password baru dan konfirmasi password tidak cocok');
    return;
  }
  
  try {
    changingPassword.value = true;
    
    const response = await axios.put('/api/users/change-password', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    
    if (response.data.success) {
      toast.success('Password berhasil diubah');
      showChangePasswordModal.value = false;
      
      // Clear form
      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Gagal mengubah password');
  } finally {
    changingPassword.value = false;
  }
};

// Delete account
const deleteAccount = async () => {
  if (deleteConfirmation.value !== 'HAPUS') {
    return;
  }
  
  try {
    deletingAccount.value = true;
    
    const response = await axios.delete('/api/users/account');
    
    if (response.data.success) {
      toast.success('Akun berhasil dihapus');
      
      // Logout
      authStore.logout();
      router.push('/');
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Gagal menghapus akun');
  } finally {
    deletingAccount.value = false;
  }
};

// Export data
const exportData = async () => {
  try {
    const response = await axios.get('/api/users/export', { responseType: 'blob' });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fanb-data.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    toast.success('Data berhasil diekspor');
  } catch (error: any) {
    toast.error('Gagal mengekspor data');
  }
};

// Clear cache
const clearCache = () => {
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  toast.success('Cache berhasil dihapus');
};

// Initialize
onMounted(() => {
  loadSettings();
  
  // Apply current theme
  document.documentElement.setAttribute('data-theme', settings.theme);
});
</script>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #f8fafc;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #f8fafc;
}

.settings-header p {
  color: #94a3b8;
}

.settings-content {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .settings-content {
    grid-template-columns: 1fr;
  }
}

.settings-sidebar {
  background-color: #1e293b;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #334155;
  height: fit-content;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #f8fafc;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
}

.settings-nav-item:hover {
  background-color: rgba(79, 70, 229, 0.1);
}

.settings-nav-item.active {
  background-color: rgba(79, 70, 229, 0.2);
  color: #818cf8;
}

.nav-icon {
  font-size: 1.25rem;
}

.settings-main {
  background-color: #1e293b;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #334155;
}

.settings-tab {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tab-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #f8fafc;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #334155;
}

.setting-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.setting-info {
  flex: 1;
}

.setting-info h3 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #f8fafc;
}

.setting-info p {
  font-size: 0.875rem;
  color: #94a3b8;
}

.setting-control {
  margin-left: 1rem;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #334155;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4f46e5;
}

input:focus + .slider {
  box-shadow: 0 0 1px #4f46e5;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* Form controls */
.form-control {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: #0f172a;
  border: 1px solid #334155;
  color: #f8fafc;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5;
}

/* Time control */
.time-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-input {
  width: 120px;
}

/* Footer */
.settings-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-outline {
  background-color: transparent;
  color: #f8fafc;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid #334155;
}

.btn-outline:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #334155;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.btn-secondary:hover {
  background-color: #475569;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-danger:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Danger zone */
.danger-zone {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #ef4444;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1e293b;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 500px;
  border: 1px solid #334155;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
}

.modal-body {
  padding: 1.25rem;
}

.warning-text {
  color: #ef4444;
  font-weight: 500;
  margin-bottom: 1rem;
}

.modal-footer {
  padding: 1.25rem;
  border-top: 1px solid #334155;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

@media (max-width: 640px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .setting-control {
    margin-left: 0;
    width: 100%;
  }
  
  .time-control {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .time-input {
    width: 100%;
  }
}
</style>
