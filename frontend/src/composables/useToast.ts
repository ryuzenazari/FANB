import { useToast as vueToastification } from 'vue-toastification';
import { computed } from 'vue';

/**
 * Composable wrapper untuk vue-toastification yang menyediakan pengaturan standar
 */
export function useToast() {
  const toast = vueToastification();
  
  const defaultOptions = computed(() => ({
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
  }));
  
  return {
    success: (message: string, options = {}) => toast.success(message, { ...defaultOptions.value, ...options }),
    error: (message: string, options = {}) => toast.error(message, { ...defaultOptions.value, ...options }),
    info: (message: string, options = {}) => toast.info(message, { ...defaultOptions.value, ...options }),
    warning: (message: string, options = {}) => toast.warning(message, { ...defaultOptions.value, ...options }),
    default: (message: string, options = {}) => toast(message, { ...defaultOptions.value, ...options }),
    clear: () => toast.clear(),
    dismiss: (id: string|number) => toast.dismiss(id)
  };
} 