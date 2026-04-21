<script setup lang="ts">
/**
 * @description: presetClick 时，change 事件在 presetClick 事件之前触发
 * @description: pick 时, change 事件在 pick 事件之后触发，与 TDatePicker 不一样
 * @description: confirm 时，change 事件在 confirm 事件之后触发
 * @description: 时间控件不会触发 pick 事件，与 TDatePicker 不一样
 * @return {*}
 */
import type {
  DateRangePickerProps as _DateRangePickerProps,
  DateRangeValue,
  PresetRange,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  cancelRangeSelectLimit: true,
  clearable: true,
  disabled: undefined,
  firstDayOfWeek: 7,
  needConfirm: true,
  presets: () =>
    ({
      上一个月: [
        dayjs().subtract(1, 'month').startOf('month').toDate(),
        dayjs().subtract(1, 'month').endOf('month').toDate(),
      ],
      最近一个月: [dayjs().subtract(1, 'month').toDate(), dayjs().toDate()],
      最近一周: [dayjs().subtract(1, 'week').toDate(), dayjs().toDate()],
      最近三个月: [dayjs().subtract(3, 'month').toDate(), dayjs().toDate()],
      本月: [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()],
    }) as PresetRange,
  readonly: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [value: DateRangeValue]
}>()

export type DateRangePickerProps = Omit<
  _DateRangePickerProps,
  'defaultValue' | 'modelValue' | 'value'
> & {
  modelValue: DateRangeValue
}

type OnChangeParams = Parameters<NonNullable<_DateRangePickerProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<DateRangePickerProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _DateRangePicker
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
          onChange: (...args: OnChangeParams) => {
            const value = args[0]
            if (value[0] === otherProps.modelValue![0] && value[1] === otherProps.modelValue![1]) {
              return
            }
            emit('update:modelValue', value)
            otherProps.onChange?.(...args)
          },
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>
