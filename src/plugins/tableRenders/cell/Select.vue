<script setup lang="ts">
import type { SelectValue } from 'tdesign-vue-next'
import type { SelectProps as _SelectProps } from '@/components/tDesignReset/TSelect.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { selectPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SelectProps>(), selectPropsInit)

export type SelectProps = Omit<_SelectProps, 'modelValue'>

const attrs = useAttrs() as unknown as CellRenderContext
const innerModelValue = defineModel<SelectValue>('modelValue', {
  get: () => _get(attrs.row, attrs.col.colKey),
  set: (value: SelectValue) => _set(attrs.row, attrs.col.colKey, value),
})
</script>

<template>
  <TSelect v-bind="props" v-model="innerModelValue!"></TSelect>
</template>

<style>
.t-table {
  .t-select__wrap {
    position: absolute;
    top: 6px;
    right: 12px;
    left: 12px;
    width: auto;
  }
}
</style>
