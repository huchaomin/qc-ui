<script setup lang="ts">
import type { TextareaProps as _TextareaProps, TextareaValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export type TextareaProps = Omit<_TextareaProps, 'defaultValue' | 'value'> & {
  modelValue: TextareaValue
}

type OnChangeParams = Parameters<NonNullable<_TextareaProps['onChange']>>
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextareaProps>(), {
  autosize: () => ({
    maxRows: Infinity,
    minRows: 2,
  }),
  maxlength: 280,
  placeholder: '请输入',
})
const emit = defineEmits<{
  'update:modelValue': [value: TextareaValue]
}>()
const otherProps = computed(() => {
  const obj: Partial<TextareaProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  console.log(obj)
  return obj
})
const compo = _Textarea
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
