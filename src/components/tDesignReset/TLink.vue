<script setup lang="ts">
import type { LinkProps as _LinkProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'
import { linkPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<LinkProps>(), {
  ...linkPropsInit,
})

export type LinkProps = Omit<_LinkProps, 'content'>

const otherProps = computed(() => {
  const obj: Partial<LinkProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Link
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
