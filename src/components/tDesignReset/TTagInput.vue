<script setup lang="ts">
import type { TagInputProps as _TagInputProps, TagInputValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TagInputProps>(), {
  disabled: undefined,
  readonly: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [value: TagInputValue]
}>()

export type TagInputProps = Omit<_TagInputProps, 'defaultValue' | 'modelValue' | 'value'> & {
  modelValue: TagInputValue
}

type OnChangeParams = Parameters<NonNullable<_TagInputProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<TagInputProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _TagInput
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
