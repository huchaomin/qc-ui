<script setup lang="ts">
import type { CellRenderContext } from '@/components/tDesignReset/TTable.d.ts'
import type { TagProps } from '@/components/tDesignReset/TTag.vue'
import { getSplitSymbolCellValue } from '../utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TagsProps>(), {
  multiple: false,
  splitSymbol: ',',
  tag: () => ({}),
})

export type TagsProps =
  | {
      /**
       * @description: 是否是多个组合在一起的值
       */
      multiple?: boolean
      /**
       * @description: 多个值之间的分隔符, 默认是逗号
       */
      splitSymbol?: string
      /**
       * @description: 标签组件的属性
       */
      tag?: Omit<TagProps, 'default'>
      tags?: never
    }
  | {
      multiple?: never
      splitSymbol?: never
      tag?: never
      tags: Array<((context: CellRenderContext) => TagProps) | TagProps>
    }

const attrs = useAttrs() as unknown as CellRenderContext
const tagArr = computed(() => {
  if (props.tags) {
    return props.tags
  }

  return getSplitSymbolCellValue({ attrs, props }).map((item) => ({
    ...props.tag,
    default: item,
  }))
})
</script>

<template>
  <div class="flex gap-1">
    <TTag
      v-for="(child, index) in tagArr"
      :key="index"
      v-bind="{
        ...(typeof child === 'function' ? child(attrs) : child),
      }"
    >
    </TTag>
  </div>
</template>
