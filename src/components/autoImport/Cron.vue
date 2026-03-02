<script lang="ts" setup>
import type { InputValue } from 'tdesign-vue-next'
import type { InputProps } from '@/components/tDesignReset/TInput.vue'
import { mergeProps } from 'vue'
import { inputPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CronProps>(), inputPropsInit)
const emit = defineEmits<{
  'update:modelValue': [value: InputValue]
}>()
const otherProps = computed(() => {
  const obj: CronProps = {
    ...props,
    placeholder: '请暂时手动输入，组件后续补上',
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})

export type CronProps = InputProps

type OnChangeParams = Parameters<NonNullable<InputProps['onChange']>>

const attrs = useAttrs()
const cronBindProps = computed(() => {
  return mergeProps(attrs, {
    ...otherProps.value,
    onChange: (...args: OnChangeParams) => {
      emit('update:modelValue', args[0])
      props.onChange?.(...args)
    },
  }) as CronProps
})
</script>

<template>
  <TInput v-bind="cronBindProps"></TInput>
</template>
