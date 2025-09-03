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
          ref: compoRef,
        },
        $slots,
      )
    "
  >
  </component>
</template>
