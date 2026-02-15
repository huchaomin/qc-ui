<script setup lang="ts">
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'

export interface FormatDateProps {
  format?: string
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormatDateProps>(), {})
const attrs = useAttrs() as unknown as CellRenderContext
const cellValue = computed(() => {
  const value = _get(attrs.row, attrs.col.colKey)

  return dayjs(value).format(props.format)
})
</script>

<template>
  {{ cellValue }}
</template>
