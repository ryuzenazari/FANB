import { defineStore } from 'pinia';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  visible: boolean;
}

interface ToastState {
  toasts: Toast[];
}

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    toasts: []
  }),
  
  actions: {
    /**
     * Menampilkan toast notification
     * @param message Pesan yang akan ditampilkan
     * @param type Tipe toast (success, error, warning, info)
     * @param duration Durasi tampilan dalam ms, default 5000
     */
    showToast(message: string, type: Toast['type'] = 'info', duration: number = 5000): string {
      const id = `toast-${Date.now()}`;
      
      // Tambahkan toast baru
      this.toasts.push({
        id,
        message,
        type,
        duration,
        visible: true
      });
      
      // Otomatis hapus toast setelah durasinya habis
      setTimeout(() => {
        this.dismissToast(id);
      }, duration);
      
      return id;
    },
    
    /**
     * Menghapus toast berdasarkan ID
     * @param id ID toast yang akan dihapus
     */
    dismissToast(id: string): void {
      const index = this.toasts.findIndex(toast => toast.id === id);
      
      if (index !== -1) {
        // Set visibility ke false untuk animasi fade out
        this.toasts[index].visible = false;
        
        // Hapus toast dari array setelah animasi selesai
        setTimeout(() => {
          this.toasts = this.toasts.filter(toast => toast.id !== id);
        }, 300); // 300ms untuk durasi animasi
      }
    },
    
    /**
     * Menghapus semua toast yang ada
     */
    clearAllToasts(): void {
      // Set semua toast visibility ke false
      this.toasts.forEach(toast => {
        toast.visible = false;
      });
      
      // Hapus semua toast setelah animasi selesai
      setTimeout(() => {
        this.toasts = [];
      }, 300);
    }
  }
}); 