<script setup lang="ts">
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'

export interface DicLabelProps {
  dicCode: string
}

const props = withDefaults(defineProps<CellRenderContext & DicLabelProps>(), {})
const dicLabel = useDicLabel(props.dicCode, props.row[props.col.colKey])
</script>

<template>
  {{ dicLabel }}
</template>
