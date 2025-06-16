<script setup lang="ts">
import type { CardProps } from 'tdesign-vue-next'
import { h } from 'vue'

const props = withDefaults(
  defineProps<CardProps>(),
  {
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
      ref: compoRef,
    }, $slots)"
  >
  </component>
</template>
