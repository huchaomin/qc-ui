<script setup lang="ts">
import type { CellRenderContext } from '@/components/tDesignReset/TTable.d.ts'
import type { TagProps } from '@/components/tDesignReset/TTag.vue'
import { getSplitSymbolCellValue } from '../utils'

export interface DicLabelProps {
  dicCode: string
  /**
   * @description: 是否是多个组合在一起的值
   */
  multiple?: boolean
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
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DicLabelProps>(), {
  multiple: false,
  renderToTag: false,
  splitSymbol: ',',
  tag: () => ({}),
})
const attrs = useAttrs() as unknown as CellRenderContext
const dicLabelArr = computed(() => {
  const cellValueArr = getSplitSymbolCellValue({ attrs, props })

  return useDicLabel(props.dicCode, cellValueArr).value.filter(Boolean)
})
</script>

<template>
  <div v-if="renderToTag" class="flex gap-1">
    <TTag v-for="item in dicLabelArr" :key="item" v-bind="tag">
      {{ item }}
    </TTag>
  </div>
  <span v-else>
    {{ dicLabelArr.join(splitSymbol) }}
  </span>
</template>
