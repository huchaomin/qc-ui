<script setup lang="ts">
import type { RangeInputProps as _RangeInputProps, RangeInputValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<RangeInputProps>(), {
  disabled: undefined,
  isNumberRange: true,
  readonly: undefined,
})

function formatNumberValue(value: RangeInputValue) {
  return value.map((item) => {
    const n = Number.parseFloat(String(item))

    if (Number.isFinite(n) === false || item === '') {
      return ''
    }

    return formatNumber(n, {
      useGrouping: false,
    })
  })
}

const innerModelValue = defineModel<RangeInputValue>('modelValue', {
  default: () => [],
  get: (value) => {
    if (props.isNumberRange) {
      return formatNumberValue(value)
    }

    return value
  },
  set: (value) => {
    if (props.isNumberRange) {
      const arr = formatNumberValue(value)

      props.onChange?.(arr)
      return arr
    }

    return value
  },
})

export type RangeInputProps = Omit<_RangeInputProps, 'defaultValue' | 'value'> & {
  isNumberRange?: boolean
  modelValue: RangeInputValue
}

type OnBlurParams = Parameters<NonNullable<_RangeInputProps['onBlur']>>
type OnChangeParams = Parameters<NonNullable<_RangeInputProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<RangeInputProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _RangeInput
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, {
          ...otherProps,
          ref: compoRef,
          modelValue: innerModelValue,
          onChange: (...args: OnChangeParams) => {
            if (isNumberRange) {
              innerModelValue = args[0]
            } else {
              onChange?.(...args)
            }
          },
          onBlur: (...args: OnBlurParams) => {
            if (isNumberRange) {
              const arr = args[0]
              if (arr.every((item) => item !== '')) {
                if (Number(arr[0]) > Number(arr[1])) {
                  innerModelValue = [arr[0]!, arr[0]!]
                }
              }
            }
            onBlur?.(...args)
          },
        }),
        $slots,
      )
    "
  >
  </component>
</template>
