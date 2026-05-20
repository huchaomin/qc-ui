<script lang="ts">
import type { SliderProps as _SliderProps, SliderValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export const sliderPropsInit = {
  disabled: undefined,
} as const
export type SliderProps = Omit<_SliderProps, 'defaultValue' | 'value'> & {
  modelValue: SliderValue
}
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SliderProps>(), sliderPropsInit)
const emit = defineEmits<{
  'update:modelValue': [value: SliderValue]
}>()

type OnChangeParams = Parameters<NonNullable<_SliderProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<SliderProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Slider
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
