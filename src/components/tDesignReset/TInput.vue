<script setup lang="ts">
import type { InputProps } from 'tdesign-vue-next'
import { h } from 'vue'

const props = withDefaults(defineProps<InputProps>(), {
  autocomplete: 'off',
  clearable: true,
})
const compo = _Input
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  vm.exposed = instance ?? {}
  vm.exposeProxy = instance ?? {}
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
