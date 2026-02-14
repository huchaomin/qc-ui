<script setup lang="ts">
import type { CheckboxProps as _CheckboxProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CheckboxProps>(), {
  value: undefined, // 多选框的值
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

export type CheckboxProps = Omit<
  _CheckboxProps,
  'checked' | 'default' | 'defaultChecked' | 'modelValue'
> & {
  modelValue: boolean
}

type OnChangeParams = Parameters<NonNullable<_CheckboxProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<CheckboxProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Checkbox
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
