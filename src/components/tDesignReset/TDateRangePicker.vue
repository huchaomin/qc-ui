<script setup lang="ts">
import type {
  DateRangePickerProps as _DateRangePickerProps,
  DateRangePickerPartial,
  DateRangeValue,
  PopupProps,
  PresetRange,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DateRangePickerProps>(), {
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
type OnConfirmParams = Parameters<NonNullable<DateRangePickerProps['onConfirm']>>
type OnPickParams = Parameters<NonNullable<DateRangePickerProps['onPick']>>
type OnPopupVisibleChangeParams = Parameters<NonNullable<PopupProps['onVisibleChange']>>

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

const hasPick = ref(false)
const hasConfirm = ref(false)
const partialArr = ref<DateRangePickerPartial[]>([])
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, {
          ...otherProps,
          onChange: (...args: OnChangeParams) => {
            const trigger = args[1].trigger
            if (
              (hasPick || hasConfirm) &&
              partialArr.length < 2 &&
              ['confirm', 'pick'].includes(trigger as string)
            ) {
              return
            }
            const value = args[0]
            if (value[0] === otherProps.modelValue![0] && value[1] === otherProps.modelValue![1]) {
              return
            }
            emit('update:modelValue', value)
            otherProps.onChange?.(...args)
          },
          onPick: (...args: OnPickParams) => {
            hasPick = true
            const partial = args[1].partial
            if (!partialArr.includes(partial)) {
              partialArr.push(partial)
            }
            otherProps.onPick?.(...args)
          },
          onConfirm: (...args: OnConfirmParams) => {
            hasConfirm = true
            const partial = args[0].partial
            if (!partialArr.includes(partial)) {
              partialArr.push(partial)
            }
            otherProps.onConfirm?.(...args)
          },
          popupProps: {
            ...(otherProps.popupProps ?? {}),
            onVisibleChange: (...args: OnPopupVisibleChangeParams) => {
              if (args[0]) {
                hasPick = false
                hasConfirm = false
                partialArr = []
              }
              otherProps.popupProps?.onVisibleChange?.(...args)
            },
          },
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>
