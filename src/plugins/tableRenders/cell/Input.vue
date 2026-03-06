<script setup lang="ts">
import type { InputValue } from 'tdesign-vue-next'
import type { InputProps as _InputProps } from '@/components/tDesignReset/TInput.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { inputPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<InputProps>(), inputPropsInit)

export type InputProps = Omit<_InputProps, 'modelValue'>

const attrs = useAttrs() as unknown as CellRenderContext
const innerModelValue = defineModel<InputValue>('modelValue', {
  get: () => _get(attrs.row, attrs.col.colKey),
  set: (value: InputValue) => _set(attrs.row, attrs.col.colKey, value),
})
</script>

<template>
  <TInput v-bind="props" v-model="innerModelValue!"></TInput>
</template>

<style>
.t-table {
  .t-input__wrap:not(.t-select__wrap .t-input__wrap) {
    position: absolute;
    top: 6px;
    right: 12px;
    left: 12px;
    width: auto;
  }
}
</style>
