<script setup lang="ts">
import type { ButtonProps } from '@/components/tDesignReset/TButton.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.d.ts'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonsProps>(), {})

export interface ButtonsProps {
  buttons: Array<((context: CellRenderContext) => ButtonProps) | ButtonProps>
}

const attrs = useAttrs() as unknown as CellRenderContext
</script>

<template>
  <div class="flex">
    <TButton
      v-for="(child, index) in props.buttons"
      :key="index"
      v-bind="{
        theme: 'primary',
        variant: 'text',
        ...(typeof child === 'function' ? child(attrs) : child),
      }"
    >
      {{ _get(attrs.row, attrs.col.colKey) }}
    </TButton>
  </div>
</template>

<style scoped>
:deep() {
  .t-button {
    + .t-button {
      margin-left: 0;
    }
  }
}
</style>
