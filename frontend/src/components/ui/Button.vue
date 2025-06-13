<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-ghost' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  rounded?: boolean
  icon?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  iconOnly?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  rounded: false,
  type: 'button',
  fullWidth: false,
  iconOnly: false,
  className: ''
})

const classes = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none transition-colors transition-transform'
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
    xl: 'text-lg px-6 py-3'
  }
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-700/30',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-700/30',
    outline: 'border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white bg-transparent hover:bg-gray-700',
    ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg shadow-red-700/30',
    'danger-ghost': 'text-red-400 hover:text-red-300 hover:bg-red-900/30',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-700/30'
  }
  
  // State classes
  const stateClasses = [
    props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
    props.loading ? 'relative text-transparent pointer-events-none' : '',
    props.block ? 'w-full' : '',
    props.rounded ? 'rounded-full' : 'rounded-lg'
  ]
  
  return [
    baseClasses, 
    sizeClasses[props.size], 
    variantClasses[props.variant], 
    ...stateClasses,
    { 'full-width': props.fullWidth },
    { 'icon-only': props.iconOnly },
    props.className
  ].join(' ')
})

// Element type: button or a
const elementType = computed(() => props.href ? 'a' : 'button')
</script>

<template>
  <button
    :class="[
      'btn',
      `variant-${variant}`,
      `size-${size}`,
      { 'full-width': fullWidth },
      { 'icon-only': iconOnly },
      className
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else-if="$slots.icon" class="btn-icon">
      <slot name="icon"></slot>
    </span>
    <span class="btn-content" :class="{ 'sr-only': iconOnly && !loading }">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  position: relative;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Variants */
.variant-primary {
  background-color: #3b82f6;
  color: white;
}
.variant-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.variant-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
}
.variant-secondary:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.15);
}

.variant-tertiary {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
}
.variant-tertiary:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.05);
}

.variant-success {
  background-color: #10b981;
  color: white;
}
.variant-success:hover:not(:disabled) {
  background-color: #059669;
}

.variant-danger {
  background-color: #ef4444;
  color: white;
}
.variant-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.variant-warning {
  background-color: #f59e0b;
  color: white;
}
.variant-warning:hover:not(:disabled) {
  background-color: #d97706;
}

.variant-info {
  background-color: #3b82f6;
  color: white;
}
.variant-info:hover:not(:disabled) {
  background-color: #2563eb;
}

.variant-ghost {
  background-color: transparent;
  color: #e5e7eb;
}
.variant-ghost:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.05);
}

.variant-link {
  background-color: transparent;
  color: #3b82f6;
  text-decoration: underline;
  padding: 0;
}
.variant-link:hover:not(:disabled) {
  color: #2563eb;
}

/* Sizes */
.size-xs {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.size-sm {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.size-md {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.size-lg {
  font-size: 1rem;
  padding: 0.625rem 1.25rem;
}

.size-xl {
  font-size: 1.125rem;
  padding: 0.75rem 1.5rem;
}

.full-width {
  width: 100%;
}

.icon-only {
  padding: 0.5rem;
  aspect-ratio: 1 / 1;
}

.size-xs.icon-only {
  padding: 0.25rem;
}

.size-sm.icon-only {
  padding: 0.375rem;
}

.size-lg.icon-only {
  padding: 0.625rem;
}

.size-xl.icon-only {
  padding: 0.75rem;
}

.spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style> 