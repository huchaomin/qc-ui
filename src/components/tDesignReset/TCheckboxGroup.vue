<script setup lang="ts">
import type { CheckboxGroupProps as _CheckboxGroupProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export type CheckboxGroupProps = Omit<_CheckboxGroupProps, 'defaultValue' | 'value'> & {
  dicCode?: string
  showCheckAll?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  showCheckAll: false,
})
const compo = _CheckboxGroup
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

const finallyOptions = computed(() => {
  let arr

  if (props.dicCode) {
    if (props.options) {
      $notify.error('TCheckboxGroup: dicCode and options cannot be used together')
    }

    arr = useDicOptions(props.dicCode).value.map((item) => ({
      label: item.label,
      value: item.value,
    })) as NonNullable<CheckboxGroupProps['options']>
  } else {
    arr = props.options
  }

  if (props.showCheckAll) {
    if (arr === undefined) {
      $notify.error('TCheckboxGroup: options is required, when showCheckAll is true')
    } else {
      arr.unshift({
        checkAll: true,
        label: '全选',
      })
    }
  }

  return arr
})
const value = defineModel({
  get() {
    if (finallyOptions.value !== undefined && props.modelValue !== undefined) {
      const isString = finallyOptions.value.every((item: any) => typeof item.value === 'string')
      const isNumber = finallyOptions.value.every((item: any) => typeof item.value === 'number')

      if (isString) {
        return props.modelValue.map((v) => (isFalsy(v) ? v : String(v)))
      } else if (isNumber) {
        return props.modelValue.map((v) => (isFalsy(v) || Number.isNaN(Number(v)) ? v : Number(v)))
      }
    }

    return props.modelValue
  },
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
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, bindProps, {
          options: finallyOptions,
          modelValue: value,
          'onUpdate:modelValue': (v: any) => {
            value = v
          },
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>
