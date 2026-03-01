<script setup lang="ts">
import type { InputProps as _InputProps, InputAdornmentProps, InputValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export type InputProps = Omit<_InputProps, 'defaultValue' | 'value'> & {
  adornment?: InputAdornmentProps
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
const otherProps = computed(() => {
  const obj: Partial<InputProps> = {
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
const compo = _Input
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}

const attrs = useAttrs()
const inputBindProps = computed(() => {
  return mergeProps(attrs, {
    ...otherProps.value,
    onChange: (...args: OnChangeParams) => {
      emit('update:modelValue', args[0])
      props.onChange?.(...args)
    },
    ref: compoRef,
  })
})
</script>

<template>
  <component
    :is="
      h(
        resolveComponent('TInputAdornment'),
        {},
        {
          ...adornment,
          default: () => h(compo, inputBindProps, $slots),
        },
      )
    "
    v-if="adornment"
  ></component>
  <component :is="h(compo, inputBindProps, $slots)" v-else></component>
</template>
