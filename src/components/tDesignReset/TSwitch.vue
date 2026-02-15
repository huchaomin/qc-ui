<script setup lang="ts">
import type { SwitchProps as _SwitchProps, SwitchValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'
import { switchPropsInit } from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SwitchProps>(), switchPropsInit)
const emit = defineEmits<{
  'update:modelValue': [value: SwitchValue]
}>()

export type SwitchProps = Omit<_SwitchProps, 'defaultValue' | 'value'> & {
  modelValue: SwitchValue
}

type OnChangeParams = Parameters<NonNullable<_SwitchProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<SwitchProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Switch
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
        mergeProps($attrs, {
          ...otherProps,
          onChange: (...args: OnChangeParams) => {
            emit('update:modelValue', args[0] ?? '')
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
