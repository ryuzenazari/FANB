<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>Profil Pengguna</h1>
      <p>Kelola informasi profil Anda</p>
    </div>
    
    <div class="profile-content">
      <div class="profile-sidebar">
        <div class="avatar-section">
          <div class="avatar-container">
            <div v-if="avatarPreview" class="avatar">
              <img :src="avatarPreview" alt="Avatar" />
            </div>
            <div v-else class="avatar-placeholder">
              {{ user?.profile?.firstName?.[0] || 'U' }}{{ user?.profile?.lastName?.[0] || '' }}
            </div>
            
            <button @click="selectAvatar" class="avatar-upload-btn">
              <span>📷</span>
            </button>
            
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarSelect"
            />
          </div>
          
          <div class="avatar-info">
            <h3>{{ user?.profile?.firstName || 'Pengguna' }} {{ user?.profile?.lastName || '' }}</h3>
            <p>{{ user?.email || '' }}</p>
          </div>
        </div>
        
        <div class="account-info">
          <div class="info-item">
            <span class="info-label">Status Akun</span>
            <span class="info-value status active">Aktif</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Paket</span>
            <span class="info-value">{{ user?.subscription?.plan || 'Free' }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Tanggal Bergabung</span>
            <span class="info-value">{{ formatDateForInput(user?.createdAt || '') }}</span>
          </div>
        </div>
      </div>
      
      <div class="profile-form">
        <form @submit.prevent="saveProfile">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Nama Depan</label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                placeholder="Nama depan"
                class="form-control"
              />
            </div>
            
            <div class="form-group">
              <label for="lastName">Nama Belakang</label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                placeholder="Nama belakang"
                class="form-control"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Email"
              class="form-control"
              disabled
            />
            <small class="form-text">Email tidak dapat diubah</small>
          </div>
          
          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea
              id="bio"
              v-model="formData.bio"
              rows="4"
              placeholder="Ceritakan tentang diri Anda"
              class="form-control"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="dateOfBirth">Tanggal Lahir</label>
              <input
                id="dateOfBirth"
                v-model="formData.dateOfBirth"
                type="date"
                class="form-control"
              />
            </div>
            
            <div class="form-group">
              <label for="timezone">Zona Waktu</label>
              <select
                id="timezone"
                v-model="formData.timezone"
                class="form-control"
              >
                <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                  {{ tz.label }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="language">Bahasa</label>
            <select
              id="language"
              v-model="formData.language"
              class="form-control"
            >
              <option v-for="lang in languages" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="saving">
              <span v-if="saving">Menyimpan...</span>
              <span v-else>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import axios from '../plugins/axios';
import { useToast } from '../composables/useToast';

// Store
const authStore = useAuthStore();
const toast = useToast();

// User data
const user = computed(() => authStore.user as any);
const saving = ref(false);

// Form fields
const formData = ref({
  firstName: '',
  lastName: '',
  bio: '',
  email: '',
  avatar: '',
  dateOfBirth: '',
  timezone: '',
  language: 'id'
});

// Avatar preview
const avatarPreview = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

// Languages
const languages = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' }
];

// Timezones
const timezones = [
  { value: 'Asia/Jakarta', label: 'Asia/Jakarta (WIB)' },
  { value: 'Asia/Makassar', label: 'Asia/Makassar (WITA)' },
  { value: 'Asia/Jayapura', label: 'Asia/Jayapura (WIT)' }
];

// Load user data
const loadUserProfile = () => {
  if (user.value?.profile) {
    formData.value = {
      firstName: user.value.profile.firstName || '',
      lastName: user.value.profile.lastName || '',
      bio: user.value.profile.bio || '',
      email: user.value.email || '',
      avatar: user.value.profile.avatar || '',
      dateOfBirth: user.value.profile.dateOfBirth || '',
      timezone: user.value.profile.timezone || 'Asia/Jakarta',
      language: user.value.profile.language || 'id'
    };
    
    if (formData.value.avatar) {
      avatarPreview.value = formData.value.avatar;
    }
  }
};

// Save user profile
const saveProfile = async () => {
  try {
    saving.value = true;
    
    const profileData = {
      profile: {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        bio: formData.value.bio,
        dateOfBirth: formData.value.dateOfBirth,
        timezone: formData.value.timezone,
        language: formData.value.language
      }
    };
    
    const response = await axios.put('/api/users/profile', profileData);
    
    if (response.data.success) {
      // Update auth store
      authStore.user = response.data.data.user;
      toast.success('Profil berhasil diperbarui');
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
  } finally {
    saving.value = false;
  }
};

// Handle avatar selection
const handleAvatarSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        avatarPreview.value = e.target.result as string;
        // TODO: Upload avatar to server
        // For this example, we'll just update the preview
      }
    };
    
    reader.readAsDataURL(file);
  }
};

// Trigger file input click
const selectAvatar = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Format date for input
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

// Initialize
onMounted(() => {
  loadUserProfile();
});
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #f8fafc;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #f8fafc;
}

.profile-header p {
  color: #94a3b8;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}

.profile-sidebar {
  background-color: #1e293b;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #334155;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #334155;
  margin-bottom: 1.5rem;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4f46e5;
  color: white;
  font-size: 2.5rem;
  font-weight: 600;
  border-radius: 50%;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4f46e5;
  border: 2px solid #1e293b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.avatar-upload-btn:hover {
  background-color: #4338ca;
}

.hidden {
  display: none;
}

.avatar-info {
  text-align: center;
}

.avatar-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.avatar-info p {
  color: #94a3b8;
  font-size: 0.875rem;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  color: #94a3b8;
}

.info-value {
  font-weight: 500;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status.active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.profile-form {
  background-color: #1e293b;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #334155;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

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

.form-control:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
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
</style>
