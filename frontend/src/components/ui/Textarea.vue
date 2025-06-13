<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  rows?: number
  maxRows?: number
  autoResize?: boolean
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  error: '',
  rows: 3,
  maxRows: 10,
  autoResize: true,
  disabled: false,
  required: false,
  id: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const uniqueId = ref(`textarea-${Math.random().toString(36).substring(2, 9)}`)
const textareaId = computed(() => props.id || uniqueId.value)

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const textareaClasses = computed(() => {
  const baseClasses = 'w-full rounded-lg bg-gray-800 border text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all px-4 py-2 resize-none'
  
  const errorClasses = props.error 
    ? 'border-red-500' 
    : 'border-gray-700 focus:border-blue-500'
  
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return `${baseClasses} ${errorClasses} ${disabledClasses}`
})

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  
  if (props.autoResize) {
    adjustHeight()
  }
}

const adjustHeight = () => {
  const textarea = textareaRef.value
  if (!textarea) return
  
  // Reset height to calculate correct scrollHeight
  textarea.style.height = 'auto'
  
  // Calculate new height (limit to maxRows)
  const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
  const maxHeight = props.maxRows * lineHeight
  const newHeight = Math.min(textarea.scrollHeight, maxHeight)
  
  textarea.style.height = `${newHeight}px`
  
  // Add scrolling if content exceeds maxHeight
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
}

// Watch for value changes to adjust height
watch(() => props.modelValue, () => {
  if (props.autoResize) {
    nextTick(adjustHeight)
  }
})

onMounted(() => {
  if (props.autoResize && props.modelValue && textareaRef.value) {
    adjustHeight()
  }
})

import { computed, nextTick } from 'vue'
</script>

<template>
  <div class="mb-4">
    <label 
      v-if="label" 
      :for="textareaId"
      class="block text-sm font-medium text-gray-400 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <textarea
      :id="textareaId"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="textareaClasses"
      @input="onInput"
    ></textarea>
    
    <p 
      v-if="error" 
      class="mt-1 text-xs text-red-500"
    >
      {{ error }}
    </p>
  </div>
</template> 