<script setup lang="ts">
import type { Ref } from 'vue'
import type { CellRenderContext, TitleRenderContext } from '@/components/tDesignReset/TTable.vue'

defineOptions({
  inheritAttrs: false,
})

const _columnWidths = inject<Ref<Record<string, number>>>('_columnWidths')!
const columnMinWidths = inject<Record<string, number>>('columnMinWidths')!
const columnMaxWidths = inject<Record<string, number>>('columnMaxWidths')!
const attrs = useAttrs() as unknown as CellRenderContext | TitleRenderContext
const wrapperRef = useTemplateRef('wrapperRef')
const showTooltip = ref(false)
const tooltipContent = ref('')

function calcWidth() {
  const width = wrapperRef.value!.getBoundingClientRect().width
  const scrollWidth = wrapperRef.value!.scrollWidth
  // eslint-disable-next-line prettier/prettier
  const parentWidth = (wrapperRef.value!.closest('td, th') as HTMLElement)!.getBoundingClientRect().width

  showTooltip.value = scrollWidth >= parentWidth - 25
  tooltipContent.value = wrapperRef.value!.textContent ?? ''

  const key = attrs.col.colKey
  const insertWidth = Math.ceil(Math.max(width, scrollWidth) + 25)
  const finallyInsertWidth = Math.max(
    Math.min(insertWidth, columnMaxWidths[key]!),
    columnMinWidths[key]!,
  )

  if (finallyInsertWidth > _columnWidths.value[key]!) {
    if (finallyInsertWidth <= parentWidth) {
      columnMinWidths[key] = finallyInsertWidth
    } else {
      _columnWidths.value[key] = finallyInsertWidth + 2
    }
  }
}

onMounted(calcWidth)
onUpdated(calcWidth)
</script>

<template>
  <TTooltip :content="tooltipContent" :disabled="!showTooltip || tooltipContent === ''">
    <div class="inline-flex max-w-full">
      <div ref="wrapperRef" class="overflow-hidden text-ellipsis whitespace-nowrap">
        <slot></slot>
      </div>
    </div>
  </TTooltip>
</template>
