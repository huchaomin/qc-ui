<script setup lang="ts">
import type { ButtonProps } from '@/components/tDesignReset/TButton.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonsProps>(), {})

export interface ButtonsProps {
  buttons: ButtonProps[]
}
</script>

<template>
  <div class="flex">
    <TButton
      v-for="(child, index) in props.buttons"
      :key="index"
      v-bind="{
        theme: 'primary',
        variant: 'text',
        ...child,
      }"
    >
      {{ child.default }}
    </TButton>
  </div>
</template>
