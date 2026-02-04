<script setup lang="ts">
import type {
  CheckboxGroupProps as _CheckboxGroupProps,
  CheckboxGroupValue,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export type CheckboxGroupProps = Omit<_CheckboxGroupProps, 'defaultValue' | 'value'> & {
  dicCode?: string
  modelValue: CheckboxGroupValue
  showCheckAll?: boolean
}

type OnChangeParams = Parameters<NonNullable<_CheckboxGroupProps['onChange']>>
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  showCheckAll: false,
})
const emit = defineEmits<{
  'update:modelValue': [value: CheckboxGroupValue]
}>()
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
    })) as CheckboxGroupProps['options']
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
const innerModelValue = computed(() => {
  if (!Array.isArray(props.modelValue)) {
    $notify.error('TCheckboxGroup: modelValue must be an array')
  } else if (finallyOptions.value !== undefined) {
    const isString = finallyOptions.value.every(
      (item: any) => typeof (item.value ?? item) === 'string',
    )
    const isNumber = finallyOptions.value.every(
      (item: any) => typeof (item.value ?? item) === 'number',
    )

    if (isString) {
      return props.modelValue.map((v) => (isFalsy(v) ? v : String(v)))
    } else if (isNumber) {
      return props.modelValue.map((v) => (isFalsy(v) || Number.isNaN(Number(v)) ? v : Number(v)))
    }
  }

  return props.modelValue
})
const otherProps = computed(() => {
  const obj: Partial<CheckboxGroupProps> = {
    ...props,
  }

  delete obj.dicCode
  delete obj.showCheckAll
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, {
          ...otherProps,
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
