<script setup lang="ts">
import type { InputProps as _InputProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export type InputProps = Omit<_InputProps, 'defaultValue' | 'value'>

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
          ...mergeProps(props, $attrs),
          ref: compoRef,
        },
        $slots,
      )
    "
  >
  </component>
</template>
