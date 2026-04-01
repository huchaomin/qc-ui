<script setup lang="ts">
import type { ImageProps as _ImageProps } from '@/components/tDesignReset/TImage.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { imagePropsInit } from '@/components/tDesignReset/TImage.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ImageProps>(), {
  ...imagePropsInit,
})

export type ImageProps = _ImageProps

const attrs = useAttrs() as unknown as CellRenderContext
const bindProps = computed(() => {
  const obj: Partial<ImageProps> = {
    ...props,
    src: isFalsy(props.src) ? _get(attrs.row, attrs.col.colKey) : props.src,
  }

  return obj
})
</script>

<template>
  <TImage
    v-if="!isFalsy(bindProps.src) || !isFalsy(bindProps.srcset) || !isFalsy(bindProps.fallback)"
    v-bind="bindProps"
    class="absolute! top-0 left-[50%] translate-x-[-50%]"
    style="height: 45px"
  ></TImage>
</template>
