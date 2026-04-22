<script setup lang="ts">
import type { CellRenderContext } from '@/components/tDesignReset/TTable.d.ts'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DefaultProps>(), {})

export interface DefaultProps {
  default?: string
}

const attrs = useAttrs() as unknown as CellRenderContext
</script>

<template>
  {{ props.default ?? _get(attrs.row, attrs.col.colKey) }}
</template>
