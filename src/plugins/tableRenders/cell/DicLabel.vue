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
const dicLabel = computed(() => useDicLabel(props.dicCode, attrs.row[attrs.col.colKey]).value)
</script>

<template>
  {{ dicLabel }}
</template>
