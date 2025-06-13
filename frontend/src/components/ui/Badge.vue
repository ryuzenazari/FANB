<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  rounded: false,
  bordered: false
})

const variantClasses = {
  default: 'bg-gray-700/50 text-gray-300',
  primary: 'bg-blue-900/40 text-blue-300',
  secondary: 'bg-purple-900/40 text-purple-300',
  success: 'bg-green-900/40 text-green-300',
  danger: 'bg-red-900/40 text-red-300',
  warning: 'bg-yellow-900/40 text-yellow-300',
  info: 'bg-cyan-900/40 text-cyan-300'
}

const sizeClasses = {
  sm: 'text-xs py-0.5 px-2',
  md: 'text-sm py-1 px-3',
  lg: 'text-base py-1.5 px-4'
}

const classes = computed(() => {
  const borderClass = props.bordered ? 'border border-current border-opacity-30' : ''
  const roundedClass = props.rounded ? 'rounded-full' : 'rounded-md'
  
  return [
    'inline-flex items-center font-medium',
    variantClasses[props.variant],
    sizeClasses[props.size],
    borderClass,
    roundedClass
  ].join(' ')
})

import { computed } from 'vue'
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template> 