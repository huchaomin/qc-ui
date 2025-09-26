<script setup lang="ts">
import type { RadioGroupProps as _RadioGroupProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

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
  delete obj.modelValue
  return obj
})
const value = defineModel({
  get() {
    if (finallyOptions.value !== undefined && !isFalsy(props.modelValue)) {
      const isString = finallyOptions.value.every(
        (item: any) => typeof item.value === 'string',
      )
      const isNumber = finallyOptions.value.every(
        (item: any) => typeof item.value === 'number',
      )

      if (isString) {
        return String(props.modelValue)
      } else if (isNumber) {
        return Number.isNaN(Number(props.modelValue))
          ? props.modelValue
          : Number(props.modelValue)
      }
    }

    return props.modelValue
  },
})
</script>

<template>
  <component
    :is="
      h(
        compo,
        {
          ...mergeProps(bindProps, $attrs),
          options: finallyOptions,
          modelValue: value,
          'onUpdate:modelValue': (v: any) => {
            value = v
          },
          ref: compoRef,
        },
        $slots,
      )
    "
  >
  </component>
</template>
