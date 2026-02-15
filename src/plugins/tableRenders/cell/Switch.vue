<script setup lang="ts">
import type { SwitchValue } from 'tdesign-vue-next'
import type { SwitchProps as _SwitchProps } from '@/components/tDesignReset/TSwitch.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { switchPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SwitchProps>(), switchPropsInit)

export type SwitchProps = Omit<_SwitchProps, 'modelValue'> & {
  modelValue?: SwitchValue
}

type OnChangeParams = Parameters<NonNullable<_SwitchProps['onChange']>>

const otherProps = computed(() => {
  const obj: Partial<SwitchProps> = {
    ...props,
  }

  delete obj.modelValue
  return obj
})
const attrs = useAttrs() as unknown as CellRenderContext
const cellValue = computed<SwitchValue>(() => _get(attrs.row, attrs.col.colKey))
const innerModelValue = defineModel<SwitchValue>('modelValue', {
  default: false,
})

watchEffect(() => {
  innerModelValue.value = cellValue.value
})
</script>

<template>
  <TSwitch
    v-bind="{
      modelValue: innerModelValue,
      onChange: (...args: OnChangeParams) => {
        if (props.beforeChange !== undefined) {
          props.onChange!(...args)
        } else {
          _set(attrs.row, attrs.col.colKey, args[0])
        }
      },
      ...otherProps,
    }"
  >
  </TSwitch>
</template>
