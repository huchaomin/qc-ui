<script lang="ts">
import type { ImageProps as _ImageProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export const imagePropsInit = {
  lazy: true,
} as const
export type ImageProps = _ImageProps
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ImageProps>(), {
  ...imagePropsInit,
})
const otherProps = computed(() => {
  const obj: Partial<ImageProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Image
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, {
          ...otherProps,
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>

<style scoped>
.t-image__wrapper {
  background: transparent;
}
</style>
