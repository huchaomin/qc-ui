<script lang="ts">
import type {
  TagInputProps as _TagInputProps,
  InputAdornmentProps,
  TagInputValue,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export const tagInputPropsInit = {
  disabled: undefined,
  readonly: undefined,
} as const
export type TagInputProps = Omit<_TagInputProps, 'defaultValue' | 'modelValue' | 'value'> & {
  adornment?: InputAdornmentProps
  modelValue: TagInputValue
}
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<TagInputProps>(), tagInputPropsInit)
const emit = defineEmits<{
  'update:modelValue': [value: TagInputValue]
}>()

type OnChangeParams = Parameters<NonNullable<_TagInputProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<TagInputProps> = {
    ...props,
  }

  delete obj.adornment
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

const tagInputBindProps = computed(() => {
  return {
    ...otherProps.value,
    onChange: (...args: OnChangeParams) => {
      emit('update:modelValue', args[0])
      props.onChange?.(...args)
    },
    ref: compoRef,
  }
})
</script>

<template>
  <component
    :is="
      h(TInputAdornment, $attrs, {
        ...adornment,
        default: () => h(compo, tagInputBindProps, $slots),
      })
    "
    v-if="adornment"
  ></component>
  <component :is="h(compo, mergeProps($attrs, tagInputBindProps), $slots)" v-else></component>
</template>
