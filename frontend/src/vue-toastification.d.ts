declare module 'vue-toastification' {
  import { App, Plugin } from 'vue'
  
  interface ToastOptions {
    position?: string
    timeout?: number
    closeOnClick?: boolean
    pauseOnFocusLoss?: boolean
    pauseOnHover?: boolean
    draggable?: boolean
    draggablePercent?: number
    showCloseButtonOnHover?: boolean
    hideProgressBar?: boolean
    closeButton?: string
    icon?: boolean
    rtl?: boolean
  }
  
  const Toast: Plugin & { [key: string]: any }
  export default Toast
  export { ToastOptions }
} 