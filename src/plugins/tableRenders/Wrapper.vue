<script setup lang="ts">
import type { Ref } from 'vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'

defineOptions({
  inheritAttrs: false,
})

const _columnWidths = inject<Ref<Record<string, number>>>('_columnWidths')!
const columnMinWidths = inject<Record<string, number>>('columnMinWidths')!
const columnMaxWidths = inject<Record<string, number>>('columnMaxWidths')!
const attrs = useAttrs() as unknown as CellRenderContext
const wrapperRef = useTemplateRef('wrapperRef')

function calcWidth() {
  const width = wrapperRef.value!.offsetWidth
  const scrollWidth = wrapperRef.value!.scrollWidth
  const parentWidth = (wrapperRef.value!.closest('td, th') as HTMLElement)!.offsetWidth
  const key = attrs.col.colKey
  const insertWidth = Math.ceil(Math.max(width, scrollWidth) + 24 + 1)
  const finallyInsertWidth = Math.max(
    Math.min(insertWidth, columnMaxWidths[key]!),
    columnMinWidths[key]!,
  )

  if (finallyInsertWidth > _columnWidths.value[key]!) {
    if (finallyInsertWidth <= parentWidth) {
      columnMinWidths[key] = finallyInsertWidth
    } else {
      _columnWidths.value[key] = finallyInsertWidth
    }
  }
}

onMounted(calcWidth)
onUpdated(calcWidth)
</script>

<template>
  <div ref="wrapperRef" class="overflow-hidden text-ellipsis whitespace-nowrap">
    <slot></slot>
  </div>
</template>
