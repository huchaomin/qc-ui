<script setup lang="ts">
import type { CardProps } from 'tdesign-vue-next'

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
</script>

<template>
  <component
    :is="
      h(
        compo,
        {
          ...props,
          ...$attrs,
          ref: compoRef,
        },
        $slots,
      )
    "
  >
  </component>
</template>
