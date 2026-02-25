<!-- 当什么都不填，返回 undefined, 已处理 -->
<script setup lang="ts">
import type { InputNumberProps as _InputNumberProps, InputNumberValue } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<InputNumberProps>(), {
  autoWidth: undefined,
  decimalPlaces: 2,
  min: 0,
  theme: 'normal',
  useGrouping: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: InputNumberValue]
}>()

export type InputNumberProps = {
  modelValue: InputNumberValue
  theme?: 'normal' | 'row'
  /**
   * @description: 是否使用分组分隔符
   * @default true
   */
  useGrouping?: boolean
} & Omit<_InputNumberProps, 'defaultValue' | 'modelValue' | 'theme' | 'value'>

type OnChangeParams = Parameters<NonNullable<_InputNumberProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<InputNumberProps> = {
    ...props,
  }

  if (obj.autoWidth === undefined && obj.theme === 'row') {
    obj.autoWidth = true
  }

  if (obj.useGrouping === true && obj.format === undefined) {
    obj.format = (value) => {
      return formatNumber(value)
    }
  }

  delete obj.useGrouping
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _InputNumber
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

<style scoped>
.t-input-number--normal {
  width: 100%;
}

.t-input-number--auto-width {
  display: inline-flex;
  align-items: center;
  max-width: 100%;

  :deep() {
    .t-input--auto-width {
      @apply flex-1;

      .t-input {
        max-width: 100%;
      }
    }
  }
}
</style>
