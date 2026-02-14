<script setup lang="ts">
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'
import type { UseListKey } from '@/hooks/useList'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<OptionLabelProps>(), {
  labelKey: 'label',
  multiple: false,
  splitSymbol: ',',
  valueKey: 'value',
})

export interface OptionLabelProps {
  /**
   * @description: 标签的键名
   */
  labelKey?: string
  /**
   * @description: 是否是多个组合在一起的值
   */
  multiple?: boolean
  /**
   * @description: 多个值之间的分隔符, 默认是逗号
   */
  splitSymbol?: string
  useListKey: UseListKey
  /**
   * @description: 值的键名
   */
  valueKey?: string
}

const attrs = useAttrs() as unknown as CellRenderContext
const rowValueArr = computed(() => {
  let v = _get(attrs.row, attrs.col.colKey)

  if (typeof v === 'number') {
    v = String(v)
  }

  if (typeof v !== 'string') {
    return []
  }

  if (props.multiple) {
    return v.split(props.splitSymbol).filter(Boolean)
  }

  return [v]
})
const label = computed(() => {
  const options = useList(props.useListKey)

  return rowValueArr.value
    .map(
      (item) =>
        options.value.find((option) => option[props.valueKey] === item)?.[props.labelKey] ?? item,
    )
    .filter(Boolean)
    .join(props.splitSymbol)
})
</script>

<template>
  {{ label }}
</template>
