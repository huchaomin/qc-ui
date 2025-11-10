<script setup lang="ts">
import type { ImageProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ImageProps>(), {
  lazy: true,
})
const compo = _Image
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
          ...mergeProps(props, $attrs),
          ref: compoRef,
        },
        $slots,
      )
    "
  >
  </component>
</template>

<style scoped>
.t-image__wrapper {
  background: transparent;
}
</style>
