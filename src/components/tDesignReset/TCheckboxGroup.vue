<script setup lang="ts">
import type { CheckboxGroupProps as _CheckboxGroupProps } from 'tdesign-vue-next'

export type CheckboxGroupProps = Omit<
  _CheckboxGroupProps,
  'defaultValue' | 'value'
> & {
  dicCode?: string
  showCheckAll?: boolean
}

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  showCheckAll: true,
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
      $notify.error(
        'TCheckboxGroup: dicCode and options cannot be used together',
      )
    }

    arr = useDicOptions(props.dicCode).value
  }

  arr = props.options

  if (props.showCheckAll) {
    if (arr === undefined) {
      $notify.error(
        'TCheckboxGroup: options is required, when showCheckAll is true',
      )
    } else {
      arr.unshift({
        label: '全选',
        value: 'all',
      })
    }
  }

  return arr
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
