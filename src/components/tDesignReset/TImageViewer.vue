<script lang="ts">
import type { ImageViewerProps as _ImageViewerProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export const imageViewerPropsInit = {
  closeBtn: true,
  closeOnEscKeydown: true,
  closeOnOverlay: true,
  draggable: true,
  navigationArrow: true,
  showOverlay: true,
} as const
export type ImageViewerProps = Omit<
  _ImageViewerProps,
  'defaultIndex' | 'defaultVisible' | 'modelValue'
>
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ImageViewerProps>(), {
  ...imageViewerPropsInit,
})
const otherProps = computed(() => {
  const obj: Partial<ImageViewerProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _ImageViewer
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}

const innerIndex = defineModel<number>('index', {
  default: 0,
})
const innerVisible = defineModel<boolean>('visible', {
  default: false,
})
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, {
          ...otherProps,
          ref: compoRef,
          index: innerIndex,
          'onUpdate:index': (value: number) => {
            innerIndex = value
          },
          visible: innerVisible,
          'onUpdate:visible': (value: boolean) => {
            innerVisible = value
          },
        }),
        $slots,
      )
    "
  >
  </component>
</template>
