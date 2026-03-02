<script setup lang="ts">
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'

export interface DicLabelProps {
  dicCode: string
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DicLabelProps>(), {})
const attrs = useAttrs() as unknown as CellRenderContext
const dicLabel = computed(() => {
  const value = _get(attrs.row, attrs.col.colKey)

  return isFalsy(value) ? '' : useDicLabel(props.dicCode, value).value
})
</script>

<template>
  {{ dicLabel }}
</template>
