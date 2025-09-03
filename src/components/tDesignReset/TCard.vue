<script setup lang="ts">
import type { CardProps } from 'tdesign-vue-next'
import { h } from 'vue'

const props = withDefaults(defineProps<CardProps>(), {
  headerBordered: true,
  shadow: true,
})
const compo = _Card
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}
  vm.exposed = exposed
  vm.exposeProxy = exposed
}

// webstorm 里面类型提示不生效
// defineExpose({} as ComponentInstance<typeof compo>)
</script>

<template>
  <component
    :is="
      h(
        compo,
        {
          ...props,
          ref: compoRef,
        },
        $slots,
      )
    "
  >
  </component>
</template>
