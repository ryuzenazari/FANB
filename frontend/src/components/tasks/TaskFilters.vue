<template>
  <div class="task-filters">
    <div class="filters-heading">
      <h2>Filter & Urutan</h2>
      <button 
        v-if="hasActiveFilters" 
        class="reset-btn" 
        @click="resetAll"
      >
        Reset Semua
      </button>
    </div>

    <div class="filters-form">
      <div class="filter-group">
        <label class="filter-label">Pencarian</label>
        <div class="search-input">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Cari tugas..."
            @input="applyFilters"
          >
          <button 
            v-if="filters.search" 
            class="clear-search" 
            @click="clearSearch"
          >×</button>
        </div>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <div class="filter-options">
          <button 
            v-for="status in statusOptions" 
            :key="status.value" 
            class="filter-pill" 
            :class="{ active: filters.status === status.value }"
            @click="toggleStatus(status.value)"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">Prioritas</label>
        <div class="filter-options">
          <button 
            v-for="priority in priorityOptions" 
            :key="priority.value" 
            class="filter-pill priority-pill" 
            :class="[
              { active: filters.priority === priority.value },
              `priority-${priority.value}`
            ]"
            @click="togglePriority(priority.value)"
          >
            {{ priority.label }}
          </button>
        </div>
      </div>
      
      <div v-if="categories.length > 0" class="filter-group">
        <label class="filter-label">Kategori</label>
        <select 
          v-model="filters.category" 
          class="select-input"
          @change="applyFilters"
        >
          <option value="">Semua Kategori</option>
          <option 
            v-for="category in categories" 
            :key="category" 
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
      
      <div v-if="tags.length > 0" class="filter-group">
        <label class="filter-label">Tag</label>
        <select 
          v-model="filters.tag" 
          class="select-input"
          @change="applyFilters"
        >
          <option value="">Semua Tag</option>
          <option 
            v-for="tag in tags" 
            :key="tag" 
            :value="tag"
          >
            {{ tag }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">Urutkan Berdasarkan</label>
        <select 
          v-model="sort.field" 
          class="select-input"
          @change="updateSort"
        >
          <option value="dueDate">Tenggat Waktu</option>
          <option value="priority">Prioritas</option>
          <option value="title">Judul</option>
          <option value="createdAt">Tanggal Dibuat</option>
          <option value="updatedAt">Terakhir Diperbarui</option>
        </select>
        
        <div class="sort-direction">
          <button 
            class="sort-btn" 
            :class="{ active: sort.order === 'asc' }"
            @click="toggleSortOrder('asc')"
          >
            ↑ Naik
          </button>
          <button 
            class="sort-btn" 
            :class="{ active: sort.order === 'desc' }"
            @click="toggleSortOrder('desc')"
          >
            ↓ Turun
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue';

// Props
const props = defineProps({
  categories: {
    type: Array as () => string[],
    default: () => []
  },
  tags: {
    type: Array as () => string[],
    default: () => []
  },
  initialFilters: {
    type: Object,
    default: () => ({})
  },
  initialSort: {
    type: Object,
    default: () => ({ field: 'dueDate', order: 'asc' })
  }
});

// Emits
const emit = defineEmits(['update-filters', 'update-sort']);

// Status options
const statusOptions = [
  { value: '', label: 'Semua' },
  { value: 'todo', label: 'Akan Dikerjakan' },
  { value: 'in-progress', label: 'Sedang Dikerjakan' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' }
];

// Priority options
const priorityOptions = [
  { value: '', label: 'Semua' },
  { value: 'low', label: 'Rendah' },
  { value: 'medium', label: 'Sedang' },
  { value: 'high', label: 'Tinggi' },
  { value: 'urgent', label: 'Mendesak' }
];

// Local state
const filters = reactive({
  status: props.initialFilters.status || '',
  priority: props.initialFilters.priority || '',
  search: props.initialFilters.search || '',
  category: props.initialFilters.category || '',
  tag: props.initialFilters.tag || ''
});

const sort = reactive({
  field: props.initialSort?.field || 'dueDate',
  order: props.initialSort?.order || 'asc'
});

// Computed
const hasActiveFilters = computed(() => {
  return filters.status !== '' || 
         filters.priority !== '' || 
         filters.search !== '' || 
         filters.category !== '' || 
         filters.tag !== '';
});

// Methods
const applyFilters = () => {
  emit('update-filters', { ...filters });
};

const clearSearch = () => {
  filters.search = '';
  applyFilters();
};

const toggleStatus = (status: string) => {
  filters.status = filters.status === status ? '' : status;
  applyFilters();
};

const togglePriority = (priority: string) => {
  filters.priority = filters.priority === priority ? '' : priority;
  applyFilters();
};

const updateSort = () => {
  emit('update-sort', { ...sort });
};

const toggleSortOrder = (order: 'asc' | 'desc') => {
  sort.order = order;
  updateSort();
};

const resetAll = () => {
  filters.status = '';
  filters.priority = '';
  filters.search = '';
  filters.category = '';
  filters.tag = '';
  sort.field = 'dueDate';
  sort.order = 'asc';
  
  applyFilters();
  updateSort();
};

// Watch for props changes
watch(() => props.initialFilters, (newFilters) => {
  if (newFilters) {
    filters.status = newFilters.status || '';
    filters.priority = newFilters.priority || '';
    filters.search = newFilters.search || '';
    filters.category = newFilters.category || '';
    filters.tag = newFilters.tag || '';
  }
}, { deep: true });

watch(() => props.initialSort, (newSort) => {
  if (newSort) {
    sort.field = newSort.field || 'dueDate';
    sort.order = newSort.order || 'asc';
  }
}, { deep: true });

// Initial emit
onMounted(() => {
  applyFilters();
  updateSort();
});
</script>

<style scoped>
.task-filters {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.filters-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.filters-heading h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #f9fafb;
  margin: 0;
}

.reset-btn {
  background: none;
  border: none;
  color: #4f90f2;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
}

.reset-btn:hover {
  text-decoration: underline;
}

.filters-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.search-input {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  font-size: 0.875rem;
}

input[type="text"] {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.25rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #f9fafb;
  font-size: 0.875rem;
}

input[type="text"]::placeholder {
  color: #6b7280;
}

input[type="text"]:focus {
  outline: none;
  border-color: #4f90f2;
  box-shadow: 0 0 0 1px rgba(79, 144, 242, 0.5);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  border-radius: 999px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-pill:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-pill.active {
  background: #4f90f2;
  border-color: #4f90f2;
  color: white;
}

.priority-pill.priority-urgent {
  border-color: #ef4444;
  color: #ef4444;
}

.priority-pill.priority-urgent.active {
  background-color: #ef4444;
  color: white;
}

.priority-pill.priority-high {
  border-color: #f97316;
  color: #f97316;
}

.priority-pill.priority-high.active {
  background-color: #f97316;
  color: white;
}

.priority-pill.priority-medium {
  border-color: #eab308;
  color: #eab308;
}

.priority-pill.priority-medium.active {
  background-color: #eab308;
  color: white;
}

.priority-pill.priority-low {
  border-color: #22c55e;
  color: #22c55e;
}

.priority-pill.priority-low.active {
  background-color: #22c55e;
  color: white;
}

.select-input {
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #f9fafb;
  font-size: 0.875rem;
  width: 100%;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.select-input:focus {
  outline: none;
  border-color: #4f90f2;
  box-shadow: 0 0 0 1px rgba(79, 144, 242, 0.5);
}

.sort-direction {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.sort-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  border-radius: 6px;
  padding: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.sort-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sort-btn.active {
  background: #4f90f2;
  border-color: #4f90f2;
  color: white;
}

/* Responsive */
@media (min-width: 768px) {
  .filters-form {
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem 1rem;
  }

  .filter-group:first-child {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1024px) {
  .filters-form {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style> 