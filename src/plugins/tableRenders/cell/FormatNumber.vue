<script setup lang="ts">
import type { CellRenderContext } from '@/components/tDesignReset/TTable.d.ts'
import type { FormatNumberConfig } from '@/utils/autoImport'

export interface FormatNumberProps {
  config?: FormatNumberConfig
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormatNumberProps>(), {})
const attrs = useAttrs() as unknown as CellRenderContext
const cellValue = computed(() => {
  const value = _get(attrs.row, attrs.col.colKey)

  return formatNumber(value, props.config)
})
</script>

<template>
  {{ cellValue }}
</template>
