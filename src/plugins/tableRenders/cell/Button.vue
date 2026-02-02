<script setup lang="ts">
import type { ButtonProps as _ButtonProps } from '@/components/tDesignReset/TButton.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { buttonPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonProps>(), {
  ...buttonPropsInit,
  theme: 'primary',
  variant: 'text',
})

export type ButtonProps = _ButtonProps

const attrs = useAttrs() as unknown as CellRenderContext
</script>

<template>
  <TButton v-bind="props">
    {{ attrs.row[attrs.col.colKey] }}
  </TButton>
</template>
