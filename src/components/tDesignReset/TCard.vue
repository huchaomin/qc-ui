<script setup lang="ts">
import type { CardProps } from 'tdesign-vue-next'
import { h } from 'vue'

const props = withDefaults(
  defineProps<CardProps>(),
  {
    headerBordered: true,
    shadow: true,
  },
)
const compo = _Card
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  vm.exposed = instance ?? {}
  vm.exposeProxy = instance ?? {}
}
</script>

<template>
  <component
    :is="h(compo, {
      ...props,
      ...$attrs,
      ref: compoRef,
    }, $slots)"
  >
  </component>
</template>
