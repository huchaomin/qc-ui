<script setup lang="ts">
import type { UseListKey } from '@/bus/autoImport/useList.ts'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.d.ts'
import type { TagProps } from '@/components/tDesignReset/TTag.vue'
import { getSplitSymbolCellValue } from '../utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<OptionLabelProps>(), {
  labelKey: 'label',
  multiple: false,
  renderToTag: false,
  splitSymbol: ',',
  tag: () => ({}),
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
  options: Array<Record<string, any>> | UseListKey
  /**
   * @description: 是否渲染为标签组件
   */
  renderToTag?: boolean
  /**
   * @description: 多个值之间的分隔符, 默认是逗号
   */
  splitSymbol?: string
  /**
   * @description: 标签组件的属性
   */
  tag?: TagProps
  /**
   * @description: 值的键名
   */
  valueKey?: string
}

const attrs = useAttrs() as unknown as CellRenderContext
const labelArr = computed(() => {
  const options = typeof props.options === 'string' ? useList(props.options).value : props.options

  if (options.length === 0) {
    return []
  }

  const cellValueArr = getSplitSymbolCellValue({ attrs, props })

  return cellValueArr
    .map(
      (item) => options.find((option) => option[props.valueKey] === item)?.[props.labelKey] ?? item,
    )
    .filter(Boolean)
})
</script>

<template>
  <div v-if="renderToTag" class="flex gap-1">
    <TTag v-for="item in labelArr" :key="item" v-bind="tag">
      {{ item }}
    </TTag>
  </div>
  <span v-else>
    {{ labelArr.join(splitSymbol) }}
  </span>
</template>
