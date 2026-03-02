<script setup lang="ts">
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'

defineOptions({
  inheritAttrs: false,
})

export interface DefaultProps {}

const attrs = useAttrs() as unknown as CellRenderContext
</script>

<template>
  {{ _get(attrs.row, attrs.col.colKey) }}
</template>
