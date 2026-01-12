<script setup lang="ts">
import type { DateRangePickerProps as _DateRangePickerProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  clearable: true,
  firstDayOfWeek: 7,
  presets: () => ({
    上一个月: [
      dayjs().subtract(1, 'month').startOf('month').toDate(),
      dayjs().subtract(1, 'month').endOf('month').toDate(),
    ],
    最近一个月: [dayjs().subtract(1, 'month').toDate(), dayjs().toDate()],
    最近一周: [dayjs().subtract(1, 'week').toDate(), dayjs().toDate()],
    最近三个月: [dayjs().subtract(3, 'month').toDate(), dayjs().toDate()],
    本月: [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()],
  }),
})

export type DateRangePickerProps = Omit<_DateRangePickerProps, 'defaultValue' | 'value'>

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
  vm.exposeProxy = exposed
}
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, otherProps, {
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>
