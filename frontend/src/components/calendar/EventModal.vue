<template>
  <div class="event-modal-backdrop" v-if="isOpen" @click.self="closeModal">
    <div class="event-modal">
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Edit Jadwal' : 'Tambah Jadwal Baru' }}</h2>
        <button class="btn-close" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="saveEvent">
          <div class="form-group">
            <label for="event-title">Judul</label>
            <input 
              id="event-title" 
              v-model="eventData.title" 
              type="text" 
              placeholder="Masukkan judul jadwal"
              required
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="event-start">Waktu Mulai</label>
              <input 
                id="event-start" 
                v-model="eventData.startTime" 
                type="datetime-local"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="event-end">Waktu Selesai</label>
              <input 
                id="event-end" 
                v-model="eventData.endTime" 
                type="datetime-local"
                required
              />
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <input 
              id="all-day" 
              v-model="eventData.isAllDay" 
              type="checkbox"
            />
            <label for="all-day">Sepanjang hari</label>
          </div>
          
          <div class="form-group">
            <label for="event-type">Tipe</label>
            <select id="event-type" v-model="eventData.type" required>
              <option value="event">Acara</option>
              <option value="meeting">Rapat</option>
              <option value="task">Tugas</option>
              <option value="focus-time">Waktu Fokus</option>
              <option value="break">Istirahat</option>
              <option value="routine">Rutinitas</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="event-location">Lokasi</label>
            <input 
              id="event-location" 
              v-model="eventData.location" 
              type="text" 
              placeholder="Masukkan lokasi (opsional)"
            />
          </div>
          
          <div class="form-group">
            <label for="event-description">Deskripsi</label>
            <textarea 
              id="event-description" 
              v-model="eventData.description" 
              placeholder="Masukkan deskripsi (opsional)"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="event-color">Warna</label>
            <div class="color-picker">
              <div 
                v-for="color in availableColors" 
                :key="color.value"
                :class="['color-option', { selected: eventData.color === color.value }]"
                :style="{ backgroundColor: color.value }"
                @click="eventData.color = color.value"
              ></div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="event-priority">Prioritas</label>
            <select id="event-priority" v-model="eventData.priority">
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button 
              type="button" 
              class="btn-secondary" 
              @click="closeModal"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Perbarui' : 'Simpan') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { format, parseISO } from 'date-fns';
import { useScheduleStore } from '../../store/schedule';
import type { Schedule } from '../../services/scheduleService';

const props = defineProps<{
  isOpen: boolean;
  eventDate?: Date;
  eventToEdit?: Schedule | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', event: Schedule): void;
}>();

const scheduleStore = useScheduleStore();
const isSubmitting = ref(false);

// Warna yang tersedia untuk dipilih
const availableColors = [
  { name: 'Biru', value: '#4285F4' },
  { name: 'Merah', value: '#DB4437' },
  { name: 'Hijau', value: '#0F9D58' },
  { name: 'Kuning', value: '#F4B400' },
  { name: 'Ungu', value: '#A142F4' },
  { name: 'Biru Muda', value: '#41B0F4' },
  { name: 'Oranye', value: '#F57C00' },
  { name: 'Merah Muda', value: '#E91E63' },
];

// Data jadwal yang akan dibuat/diedit
const eventData = reactive<Partial<Schedule>>({
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  isAllDay: false,
  type: 'event',
  location: '',
  color: '#4285F4',
  recurrence: 'none',
  priority: 'medium',
  status: 'scheduled',
});

// Mode edit atau tambah baru
const isEditMode = computed(() => !!props.eventToEdit);

// Mengatur nilai awal berdasarkan props
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm();
    
    if (props.eventToEdit) {
      // Mode edit: isi form dengan data yang sudah ada
      Object.keys(eventData).forEach(key => {
        const k = key as keyof typeof eventData;
        if (props.eventToEdit && props.eventToEdit[k] !== undefined) {
          if (k === 'startTime' || k === 'endTime') {
            // Format tanggal untuk input datetime-local
            const dateValue = props.eventToEdit[k];
            if (dateValue) {
              eventData[k] = formatDateForInput(dateValue);
            }
          } else {
            // @ts-ignore - Abaikan error tipe
            eventData[k] = props.eventToEdit[k];
          }
        }
      });
    } else if (props.eventDate) {
      // Mode tambah baru: isi tanggal berdasarkan props
      const date = props.eventDate;
      const startHour = new Date().getHours();
      
      // Set waktu mulai ke jam sekarang, dibulatkan ke jam penuh berikutnya
      date.setHours(startHour + 1, 0, 0, 0);
      eventData.startTime = formatDateForInput(date);
      
      // Set waktu selesai ke 1 jam setelah waktu mulai
      const endDate = new Date(date);
      endDate.setHours(startHour + 2, 0, 0, 0);
      eventData.endTime = formatDateForInput(endDate);
    }
  }
}, { immediate: true });

// Reset form ke nilai default
const resetForm = () => {
  Object.assign(eventData, {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isAllDay: false,
    type: 'event',
    location: '',
    color: '#4285F4',
    recurrence: 'none',
    priority: 'medium',
    status: 'scheduled',
  });
};

// Format tanggal untuk input datetime-local
const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd'T'HH:mm");
};

// Simpan jadwal
const saveEvent = async () => {
  try {
    isSubmitting.value = true;
    
    // Validasi form
    if (!eventData.title || !eventData.startTime || !eventData.endTime) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }
    
    // Pastikan format tanggal benar
    const formattedData = {
      ...eventData,
      startTime: new Date(eventData.startTime).toISOString(),
      endTime: new Date(eventData.endTime).toISOString()
    };
    
    // Validasi bahwa waktu akhir harus setelah waktu mulai
    if (new Date(formattedData.endTime) <= new Date(formattedData.startTime)) {
      alert('Waktu selesai harus lebih dari waktu mulai');
      isSubmitting.value = false;
      return;
    }
    
    // Hapus kategori jika kosong untuk menghindari error validasi
    if (!formattedData.category) {
      delete formattedData.category;
    }
    
    console.log('Saving event data:', formattedData);
    
    let result;
    
    if (isEditMode.value && props.eventToEdit?._id) {
      // Update jadwal yang sudah ada
      result = await scheduleStore.updateSchedule(props.eventToEdit._id, formattedData);
    } else {
      // Buat jadwal baru
      result = await scheduleStore.createSchedule(formattedData as Omit<Schedule, '_id'>);
    }
    
    emit('saved', result);
    closeModal();
  } catch (error) {
    console.error('Error saving event:', error);
    alert(`Gagal menyimpan jadwal: ${(error as Error).message || 'Terjadi kesalahan'}`);
  } finally {
    isSubmitting.value = false;
  }
};

// Tutup modal
const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.event-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.event-modal {
  background-color: var(--surface-2, rgba(30, 41, 59, 0.7));
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-primary, #F9FAFB);
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-secondary, #CED3DB);
}

.btn-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary, #CED3DB);
}

input[type="text"],
input[type="datetime-local"],
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-primary, #F9FAFB);
}

input[type="text"]:focus,
input[type="datetime-local"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--primary, #5469FF);
  box-shadow: 0 0 0 2px rgba(84, 105, 255, 0.2);
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23CED3DB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
  padding-right: 2rem;
}

option {
  background-color: var(--surface-2, rgba(30, 41, 59, 0.7));
  color: var(--text-primary, #F9FAFB);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group label {
  margin-bottom: 0;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary, #5469FF);
  cursor: pointer;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  box-shadow: 0 0 0 2px var(--background, #0B101E), 0 0 0 4px var(--primary, #5469FF);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary, #5469FF);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark, #3E51DB);
}

.btn-primary:disabled {
  background-color: rgba(84, 105, 255, 0.3);
  cursor: not-allowed;
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary, #F9FAFB);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style> 