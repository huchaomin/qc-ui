<script setup lang="ts">
import type { ImageViewerProps as _ImageViewerProps } from '@/components/tDesignReset/TImageViewer.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { imageViewerPropsInit } from '@/components/tDesignReset/TImageViewer.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ImageViewerProps>(), {
  ...imageViewerPropsInit,
})

export type ImageViewerProps = _ImageViewerProps

const attrs = useAttrs() as unknown as CellRenderContext
const bindProps = computed(() => {
  const val = _get(attrs.row, attrs.col.colKey)
  const obj: Partial<ImageViewerProps> = {
    ...props,
    images: isFalsy(props.images) ? (isFalsy(val) ? [] : [val]) : props.images,
  }

  return obj
})
</script>

<template>
  <TImageViewer
    v-if="!isFalsy(bindProps.images) && bindProps.images!.length > 0"
    v-bind="bindProps"
  ></TImageViewer>
</template>

<style>
.t-table {
  .t-image-viewer__trigger {
    @apply absolute! top-0 left-[50%] translate-x-[-50%];
  }
}
</style>
