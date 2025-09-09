<script setup lang="ts">
import type { CheckboxProps as _CheckboxProps } from 'tdesign-vue-next'

export type CheckboxProps = Omit<_CheckboxProps, 'checked' | 'defaultChecked'>

const props = withDefaults(defineProps<CheckboxProps>(), {})
const compo = _Checkbox
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
