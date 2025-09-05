<script setup lang="ts">
import type { RadioGroupProps as _RadioGroupProps } from 'tdesign-vue-next'

export type RadioGroupProps = XOR<
  _RadioGroupProps & {
    options: NonNullable<_RadioGroupProps['options']>
  },
  Omit<_RadioGroupProps, 'options'> & {
    dicCode: string // TODO
  }
>
const props = withDefaults(defineProps<RadioGroupProps>(), {})
const compo = _RadioGroup
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
