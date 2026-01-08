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
  scroll: () => ({
    isFixedRowHeight: true,
    rowHeight: 49, // TODO
    threshold: 500,
    type: 'virtual',
  }),
  selectOnRowClick: true,
  showHeader: true,
  stripe: true,
  tableLayout: 'auto',
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
 * @description: ellipsis width ellipsisTitle
 * @description: className 添加 class
 * @description: attrs 添加 style
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
