<script setup lang="ts">
import type { RadioGroupProps as _RadioGroupProps } from 'tdesign-vue-next'

export type RadioGroupProps = Omit<
  _RadioGroupProps,
  'defaultValue' | 'value'
> & {
  dicCode?: string
}

const props = withDefaults(defineProps<RadioGroupProps>(), {})
const compo = _RadioGroup
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

const finallyOptions = computed(() => {
  if (props.dicCode) {
    if (props.options) {
      $notify.error('TRadioGroup: dicCode and options cannot be used together')
    }

    return useDicOptions(props.dicCode).value
  }

  return props.options
})
const bindProps = computed(() => {
  const obj: Record<string, any> = {
    ...props,
  }

  delete obj.options
  delete obj.dicCode
  return obj
})
</script>

<template>
  <component
    :is="
      h(
        compo,
        {
          ...bindProps,
          ...$attrs,
          options: finallyOptions,
          ref: compoRef,
        },
        $slots,
      )
    "
  >
  </component>
</template>
