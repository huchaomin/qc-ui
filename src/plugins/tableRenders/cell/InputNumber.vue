<script setup lang="ts">
import type { InputNumberValue } from 'tdesign-vue-next'
import type { InputNumberProps as _InputNumberProps } from '@/components/tDesignReset/TInputNumber.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { inputNumberPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<InputNumberProps>(), inputNumberPropsInit)

export type InputNumberProps = Omit<_InputNumberProps, 'modelValue'>

const attrs = useAttrs() as unknown as CellRenderContext
const innerModelValue = defineModel<InputNumberValue>('modelValue', {
  get: () => _get(attrs.row, attrs.col.colKey),
  set: (value: InputNumberValue) => _set(attrs.row, attrs.col.colKey, value),
})
</script>

<template>
  <TInputNumber v-bind="props" v-model="innerModelValue!"></TInputNumber>
</template>

<style>
.t-table {
  .t-input-number {
    position: absolute;
    top: 6px;
    right: 12px;
    left: 12px;
    width: auto;
  }
}
</style>
