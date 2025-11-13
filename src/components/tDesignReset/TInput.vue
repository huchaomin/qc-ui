<script setup lang="ts">
import type { InputProps as _InputProps, InputValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export type InputProps = Omit<_InputProps, 'defaultValue' | 'value'> & {
  modelValue: InputValue
}

type OnChangeParams = Parameters<NonNullable<_InputProps['onChange']>>
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<InputProps>(), {
  autocomplete: 'off',
  clearable: true,
  placeholder: '请输入',
})
const emit = defineEmits<{
  'update:modelValue': [value: InputValue]
}>()
const compo = _Input
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
        mergeProps($attrs, props, {
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
