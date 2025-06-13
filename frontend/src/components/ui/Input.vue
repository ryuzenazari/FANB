<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
  maxLength?: number
  autoFocus?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  type: 'text',
  error: '',
  disabled: false,
  required: false,
  id: '',
  maxLength: undefined,
  autoFocus: false,
  icon: '',
  iconPosition: 'left'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const uniqueId = ref(`input-${Math.random().toString(36).substring(2, 9)}`)
const inputId = computed(() => props.id || uniqueId.value)
const inputRef = ref<HTMLInputElement | null>(null)

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const inputClasses = computed(() => {
  const baseClasses = 'w-full rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all border'
  
  const errorClasses = props.error 
    ? 'border-red-500' 
    : 'border-gray-700 focus:border-blue-500'
  
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  const iconClasses = props.icon ? `${props.iconPosition === 'left' ? 'pl-10' : 'pr-10'}` : 'px-4'
  
  return `${baseClasses} ${errorClasses} ${disabledClasses} ${iconClasses} py-2`
})
</script>

<template>
  <div class="mb-4">
    <label 
      v-if="label" 
      :for="inputId"
      class="block text-sm font-medium text-gray-400 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <span 
        v-if="icon && iconPosition === 'left'" 
        class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"
      >
        {{ icon }}
      </span>
      
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :maxlength="maxLength"
        :autofocus="autoFocus"
        :class="inputClasses"
        @input="updateValue"
      />
      
      <span 
        v-if="icon && iconPosition === 'right'" 
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
      >
        {{ icon }}
      </span>
    </div>
    
    <p 
      v-if="error" 
      class="mt-1 text-xs text-red-500"
    >
      {{ error }}
    </p>
  </div>
</template> 