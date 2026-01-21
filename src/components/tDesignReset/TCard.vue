<script setup lang="ts">
import type { CardProps as _CardProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CardProps>(), {
  bodyFullHeight: false,
  headerBordered: true,
  shadow: true,
})

export type CardProps = _CardProps & {
  bodyFullHeight?: boolean
}

const otherProps = computed(() => {
  const obj: Partial<CardProps> = {
    ...props,
  }

  delete obj.bodyFullHeight
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Card
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, otherProps, {
          ref: compoRef,
          class: bodyFullHeight ? 'flex flex-col' : '',
          bodyClassName: [bodyFullHeight ? 'flex-1' : '', otherProps.bodyClassName]
            .filter(Boolean)
            .join(' '),
        }),
        $slots,
      )
    "
  >
  </component>
</template>
