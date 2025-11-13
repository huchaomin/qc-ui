<script setup lang="ts">
import type { RadioGroupProps as _RadioGroupProps, RadioValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export type RadioGroupProps = Omit<_RadioGroupProps, 'defaultValue' | 'value'> & {
  dicCode?: string
  modelValue: RadioValue
}

type OnChangeParams = Parameters<NonNullable<_RadioGroupProps['onChange']>>
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<RadioGroupProps>(), {})
const emit = defineEmits<{
  'update:modelValue': [value: RadioValue]
}>()
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

    return useDicOptions(props.dicCode).value.map((item) => ({
      label: item.label,
      value: item.value,
    }))
  }

  return props.options
})
const bindProps = computed(() => {
  const obj: Record<string, any> = {
    ...props,
  }

  delete obj.dicCode
  return obj
})
const innerModelValue = computed(() => {
  if (finallyOptions.value !== undefined && !isFalsy(props.modelValue)) {
    const isString = finallyOptions.value.every(
      (item: any) => typeof (item.value ?? item) === 'string',
    )
    const isNumber = finallyOptions.value.every(
      (item: any) => typeof (item.value ?? item) === 'number',
    )

    if (isString) {
      return String(props.modelValue)
    } else if (isNumber) {
      return Number.isNaN(Number(props.modelValue)) ? props.modelValue : Number(props.modelValue)
    }
  }

  return props.modelValue
})
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, bindProps, {
          options: finallyOptions,
          modelValue: innerModelValue,
          onChange: (...args: OnChangeParams) => {
            emit('update:modelValue', args[0])
            props.onChange?.(...args)
          },
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>
