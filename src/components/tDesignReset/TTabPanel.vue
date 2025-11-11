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
        mergeProps($attrs, props, {
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>
