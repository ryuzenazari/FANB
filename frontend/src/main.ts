import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuthStore } from './store/auth'
import './plugins/axios'

// Import Toast
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Import global components
import Button from './components/ui/Button.vue'
import Card from './components/ui/Card.vue'
import Badge from './components/ui/Badge.vue'
import Input from './components/ui/Input.vue'
import Textarea from './components/ui/Textarea.vue'
import Modal from './components/ui/Modal.vue'
import LoadingSpinner from './components/ui/LoadingSpinner.vue'

const app = createApp(App)
const pinia = createPinia()

// Konfigurasi toast
const toastOptions = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
};

// Register global components
app.component('Button', Button)
app.component('Card', Card)
app.component('Badge', Badge)
app.component('Input', Input)
app.component('Textarea', Textarea)
app.component('Modal', Modal)
app.component('LoadingSpinner', LoadingSpinner)

// Use plugins
app.use(pinia)
app.use(router)
app.use(Toast, toastOptions)

// Inisialisasi autentikasi
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')
