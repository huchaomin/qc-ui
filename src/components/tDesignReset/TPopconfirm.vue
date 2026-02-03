<script setup lang="ts">
import type { PopconfirmProps as _PopconfirmProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PopconfirmProps>(), {
  destroyOnClose: true,
  showArrow: true,
  theme: 'warning',
  visible: undefined,
})

export type PopconfirmProps = Omit<_PopconfirmProps, 'triggerElement'>

const otherProps = computed(() => {
  const obj: Partial<PopconfirmProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Popconfirm
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
        }),
        $slots,
      )
    "
  >
  </component>
</template>
