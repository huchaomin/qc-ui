<script setup lang="ts">
import type { InputProps as _InputProps } from 'tdesign-vue-next'

export type InputProps = _InputProps

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
          ...$attrs,
          ref: compoRef,
        },
        $slots,
      )
    "
  >
  </component>
</template>
