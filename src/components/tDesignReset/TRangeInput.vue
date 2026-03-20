<script setup lang="ts">
import type { RangeInputProps as _RangeInputProps, RangeInputValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<RangeInputProps>(), {
  decimalPlaces: 2,
  disabled: undefined,
  isNumberRange: true,
  max: Infinity,
  min: 0,
  readonly: undefined,
})

function formatNumberValue(value: RangeInputValue, formatEnd: boolean = true) {
  return value.map((item) => {
    const n = Number.parseFloat(String(item))

    if (Number.isFinite(n) === false || item === '') {
      return ''
    }

    if (String(item).endsWith('.') && !formatEnd) {
      return `${n}.`
    }

    const result = Number(
      formatNumber(n, {
        maximumFractionDigits: formatEnd ? props.decimalPlaces : 100,
        useGrouping: false,
      }),
    )

    if (formatEnd) {
      return Math.min(Math.max(result, props.min), props.max)
    } else {
      return result
    }
  })
}

const innerModelValue = defineModel<RangeInputValue>('modelValue', {
  default: () => [],
  get: (value) => {
    if (props.isNumberRange) {
      return formatNumberValue(value, false)
    }

    return value
  },
  set: (value) => {
    if (props.isNumberRange) {
      const arr = formatNumberValue(value, false)

      props.onChange?.(arr)
      return arr
    }

    return value
  },
})

export type RangeInputProps = Omit<_RangeInputProps, 'defaultValue' | 'value'> & {
  decimalPlaces?: number
  isNumberRange?: boolean
  max?: number
  min?: number
  modelValue: RangeInputValue
}

type OnBlurParams = Parameters<NonNullable<_RangeInputProps['onBlur']>>
type OnChangeParams = Parameters<NonNullable<_RangeInputProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<RangeInputProps> = {
    ...props,
  }

  delete obj.isNumberRange
  delete obj.decimalPlaces
  delete obj.max
  delete obj.min
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
            // 两个输入框切换时也会触发 onBlur
            if (isNumberRange) {
              const arr = args[0]
              if (arr.every((item) => !isFalsy(item))) {
                if (Number(arr[0]) > Number(arr[1])) {
                  innerModelValue = formatNumberValue([arr[0]!, arr[0]!])
                  onBlur?.(...args)
                  return
                }
              }
              innerModelValue = formatNumberValue([arr[0], arr[1]])
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
