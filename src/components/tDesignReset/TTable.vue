<script setup lang="ts">
import type { EnhancedTableProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TableProps>(), {
  bordered: true,
  columnResizeMaxWidth: 600,
  columnResizeMinWidth: 80,
  disableDataPage: true,
  disableSpaceInactiveRow: true,
  hover: true,
  lazyLoad: true, // 开启整个表格的懒加载
  resizable: true,
  rowKey: '_ROW_KEY', // footer data 不需要考虑
  rowSelectionAllowUncheck: false, // 行选中单选场景，是否允许取消选中
  scroll: () => ({
    isFixedRowHeight: true,
    rowHeight: 49, // TODO
    threshold: 500,
    type: 'virtual',
  }),
  selectOnRowClick: true,
  showHeader: true,
  stripe: true,
  tableLayout: 'fixed',
})

export type TableProps = Omit<EnhancedTableProps, 'columns' | 'data' | 'rowKey'> & {
  columnResizeMaxWidth?: number
  columnResizeMinWidth?: number
  columns: NonNullable<EnhancedTableProps['columns']>
  data: NonNullable<EnhancedTableProps['data']>
  rowKey?: string
}

const data = computed(() => {
  return props.data.map((item, index) => {
    return {
      ...item,
      _ROW_KEY: _.uniqueId(String(index)),
    }
  })
})
/**
 * @description: ellipsis width ellipsisTitle fixed
 * @description: className 添加 class
 * @description: attrs 添加 style
 * @description: cell 添加 自定义渲染， 函数参数为：{col, colIndex, row, rowIndex} https://tdesign.tencent.com/vue-next/components/table?tab=demo#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8D%95%E5%85%83%E6%A0%BC%E7%9A%84%E8%A1%A8%E6%A0%BC
 * @description: title 定义标题数据
 * @description: foot 定义底部数据
 */
const columns = computed(() => {
  const arr = props.columns.map((column) => {
    return {
      ellipsis: true,
      ellipsisTitle: true,
      ...column,
      resize: {
        maxWidth: column.resize?.maxWidth ?? props.columnResizeMaxWidth,
        minWidth: column.resize?.minWidth ?? props.columnResizeMinWidth,
      },
    }
  })

  console.log('tableColumns', arr)
  return arr
})
const otherProps = computed(() => {
  const obj: Partial<TableProps> = {
    ...props,
  }

  delete obj.columns
  delete obj.data
  delete obj.columnResizeMinWidth
  delete obj.columnResizeMaxWidth
  delete obj.allowResizeColumnWidth // 已废弃的属性
  delete obj.sortOnRowDraggable // 已废弃的属性
  // 解决点击row报错的问题
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  console.log('tableOtherProps', obj)
  return obj
})
const compo = _Table
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, otherProps, {
          ref: compoRef,
          columns,
          data,
        }),
        $slots,
      )
    "
  >
  </component>
</template>

<style scoped>
:deep() {
  .t-table__content::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  .t-table__content::-webkit-scrollbar-thumb {
    cursor: pointer;
  }
}
</style>
