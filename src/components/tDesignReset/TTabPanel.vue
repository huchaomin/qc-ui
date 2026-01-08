<script setup lang="ts">
import type { TabPanelProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
  // eslint-disable-next-line vue/order-in-components
  name: 'TTabPanel',
})

const props = withDefaults(defineProps<TabPanelProps>(), {
  destroyOnHide: false,
  lazy: true,
})
const otherProps = computed(() => {
  const obj: Partial<TabPanelProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _TabPanel
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
