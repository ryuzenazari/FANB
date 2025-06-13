import { defineStore } from 'pinia';

interface LoadingState {
  isLoading: Record<string, boolean>;
  loadingCount: number;
}

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    isLoading: {},
    loadingCount: 0
  }),
  
  getters: {
    anyLoading: (state) => state.loadingCount > 0,
    
    /**
     * Memeriksa apakah komponen/operasi tertentu sedang dalam state loading
     * @param key - Identifier untuk loading state
     */
    isComponentLoading: (state) => (key: string) => state.isLoading[key] || false
  },
  
  actions: {
    /**
     * Memulai loading state untuk komponen/operasi tertentu
     * @param key - Identifier untuk loading state
     */
    startLoading(key: string) {
      if (!this.isLoading[key]) {
        this.isLoading[key] = true;
        this.loadingCount++;
      }
    },
    
    /**
     * Mengakhiri loading state untuk komponen/operasi tertentu
     * @param key - Identifier untuk loading state
     */
    finishLoading(key: string) {
      if (this.isLoading[key]) {
        this.isLoading[key] = false;
        this.loadingCount = Math.max(0, this.loadingCount - 1);
      }
    },
    
    /**
     * Mengatur loading state untuk komponen/operasi tertentu
     * @param key - Identifier untuk loading state
     * @param isLoading - Status loading (true/false)
     */
    setLoading(key: string, isLoading: boolean) {
      if (isLoading) {
        this.startLoading(key);
      } else {
        this.finishLoading(key);
      }
    },
    
    /**
     * Menjalankan fungsi dengan loading state otomatis
     * @param key - Identifier untuk loading state
     * @param fn - Fungsi/Promise yang akan dijalankan
     */
    async withLoading<T>(key: string, fn: () => Promise<T>): Promise<T> {
      try {
        this.startLoading(key);
        return await fn();
      } finally {
        this.finishLoading(key);
      }
    },
    
    /**
     * Reset semua loading state
     */
    resetAll() {
      this.isLoading = {};
      this.loadingCount = 0;
    }
  }
}); 