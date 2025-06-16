<script setup lang="ts">
import type { ImageProps } from 'tdesign-vue-next'
import { h } from 'vue'

const props = withDefaults(
  defineProps<ImageProps>(),
  {
    lazy: true,
  },
)
const compo = _Image
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

<style scoped>
.t-image__wrapper{
  background: transparent;
}
</style>
