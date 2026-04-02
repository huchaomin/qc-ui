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
const padding = 25
const calcWidth = useThrottleFn(
  () => {
    if (wrapperRef.value === null) {
      return
    }

    const width = wrapperRef.value!.getBoundingClientRect().width
    const scrollWidth = wrapperRef.value!.scrollWidth
    // eslint-disable-next-line prettier/prettier
  const parentWidth = (wrapperRef.value!.closest('td, th') as HTMLElement)!.getBoundingClientRect().width
    const key = attrs.col.colKey
    const maxWidth = columnMaxWidths[key]!

    showTooltip.value = Number.isFinite(maxWidth)
      ? scrollWidth >= parentWidth - padding
      : scrollWidth > parentWidth - padding
    tooltipContent.value = wrapperRef.value!.textContent.trim() ?? ''

    const insertWidth = Math.ceil(Math.max(width, scrollWidth) + padding)
    const finallyInsertWidth = Math.max(Math.min(insertWidth, maxWidth), columnMinWidths[key]!)

    if (finallyInsertWidth > _columnWidths.value[key]!) {
      if (finallyInsertWidth <= parentWidth) {
        columnMinWidths[key] = finallyInsertWidth
      } else {
        _columnWidths.value[key] = finallyInsertWidth + 2
      }
    }
  },
  500,
  true,
)

onMounted(calcWidth)
onUpdated(calcWidth)
useMutationObserver(
  wrapperRef,
  (mutations) => {
    mutations.forEach(() => {
      calcWidth()
    })
  },
  {
    characterData: true,
    childList: true,
    subtree: true,
  },
)
</script>

<template>
  <div class="inline-flex max-w-full">
    <TTooltip v-if="showTooltip" :content="tooltipContent">
      <div ref="wrapperRef" class="overflow-hidden text-ellipsis whitespace-nowrap">
        <slot></slot>
      </div>
    </TTooltip>
    <div v-else ref="wrapperRef" class="overflow-hidden text-ellipsis whitespace-nowrap">
      <slot></slot>
    </div>
  </div>
</template>
