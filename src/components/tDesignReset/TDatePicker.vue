<script setup lang="ts">
import type {
  DatePickerProps as _DatePickerProps,
  DateMultipleValue,
  DateValue,
  PresetDate,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DatePickerProps>(), {
  clearable: true,
  disabled: undefined,
  needConfirm: false,
  presets: () =>
    ({
      一周前: dayjs().subtract(1, 'week').toDate(),
      今天: dayjs().toDate(),
      昨天: dayjs().subtract(1, 'day').toDate(),
    }) as PresetDate,
  readonly: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [value: DateMultipleValue | DateValue]
}>()

export type DatePickerProps = Omit<_DatePickerProps, 'defaultValue' | 'modelValue' | 'value'> & {
  modelValue: DateMultipleValue | DateValue
}

type OnChangeParams = Parameters<NonNullable<_DatePickerProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<DatePickerProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _DatePicker
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
