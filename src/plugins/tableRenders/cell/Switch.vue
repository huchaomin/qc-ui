<script setup lang="ts">
import type { SwitchValue } from 'tdesign-vue-next'
import type { SwitchProps as _SwitchProps } from '@/components/tDesignReset/TSwitch.vue'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import { switchPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SwitchProps>(), switchPropsInit)

export type SwitchProps = Omit<_SwitchProps, 'modelValue'>

const attrs = useAttrs() as unknown as CellRenderContext
const innerModelValue = defineModel<SwitchValue>('modelValue', {
  get: () => _get(attrs.row, attrs.col.colKey),
  set: (value: SwitchValue) => _set(attrs.row, attrs.col.colKey, value),
})
</script>

<template>
  <TSwitch v-bind="props" v-model="innerModelValue!"></TSwitch>
</template>
