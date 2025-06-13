<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  hover?: boolean
  clickable?: boolean
  glassmorphism?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  shadow: 'md',
  border: true,
  hover: false,
  clickable: false,
  glassmorphism: true
})

const paddingClasses = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7'
}

const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg'
}

const classes = computed(() => {
  const baseClasses = [
    'rounded-xl overflow-hidden',
    paddingClasses[props.padding],
    shadowClasses[props.shadow]
  ]
  
  if (props.border) baseClasses.push('border border-gray-800')
  if (props.hover) baseClasses.push('transition-all duration-300 hover:shadow-xl hover:-translate-y-1')
  if (props.clickable) baseClasses.push('cursor-pointer')
  if (props.glassmorphism) baseClasses.push('bg-gray-800/40 backdrop-blur-md')
  else baseClasses.push('bg-gray-800')
  
  return baseClasses.join(' ')
})
</script>

<template>
  <div :class="classes" @click="$emit('click', $event)">
    <slot />
  </div>
</template>

<style scoped>
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style> 