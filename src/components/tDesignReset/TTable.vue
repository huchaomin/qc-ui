<script lang="ts">
import type {
  TableCol as _TableCol,
  CellData,
  EnhancedTableInstanceFunctions,
  EnhancedTableProps,
  TableRowData,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export const propsInit = {
  bordered: true,
  disableDataPage: true,
  disableSpaceInactiveRow: true,
  hover: true,
  lazyLoad: true, // 开启整个表格的懒加载
  resizable: true,
  rowKey: '_ROW_KEY', // footer data 不需要考虑
  rowSelectionAllowUncheck: false, // 行选中单选场景，是否允许取消选中
  scroll: () => ({
    isFixedRowHeight: true,
    rowHeight: 45,
    threshold: 500,
    type: 'virtual' as const,
  }),
  selectOnRowClick: true,
  showHeader: true,
  stripe: true,
  tableLayout: 'fixed',
} as const

export type TableCol = {
  /**
   * @description: 列拖动的最大值最小值，感觉有bug
   * @return {*}
   */
  resize?: {
    maxWidth?: number
    minWidth?: number
  }
} & Omit<_TableCol<TableRowData>, 'resize'>

export type TableProps = Omit<
  EnhancedTableProps,
  | 'allowResizeColumnWidth'
  | 'columns'
  | 'data'
  | 'fixedRows'
  | 'footerAffixProps'
  | 'headerAffixProps'
  | 'rowKey'
  | 'sortOnRowDraggable'
> & {
  columns: Array<TableCol>
  data: Array<TableRowData>
  rowKey?: string
}
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TableProps>(), propsInit)
const data = computed(() => {
  return props.data.map((item, index) => {
    return {
      ...item,
      _ROW_KEY: _.uniqueId(String(index)),
    }
  })
})
const _columnWidths = shallowRef<number[]>([])
const columnWidths = refDebounced(_columnWidths, 500)
const columnMinWidths = reactive<number[]>([])
const columnMaxWidths = reactive<number[]>([])

function getResize(column: TableCol) {
  return {
    maxWidth: column.resize?.maxWidth ?? Infinity,
    minWidth: column.resize?.minWidth ?? 60,
  }
}

watch(
  () => props.columns,
  (columns) => {
    columns.forEach((column, index) => {
      const resize = getResize(column)

      _columnWidths.value = []
      columnMinWidths[index] = resize.minWidth
      columnMaxWidths[index] = resize.maxWidth
    })
  },
  {
    deep: true,
    immediate: true,
  },
)

/**
 * @description: ellipsis width ellipsisTitle fixed
 * @description: className 添加 class
 * @description: attrs 添加 style
 * @description: cell 添加 自定义渲染， 函数参数为：{col, colIndex, row, rowIndex} https://tdesign.tencent.com/vue-next/components/table?tab=demo#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8D%95%E5%85%83%E6%A0%BC%E7%9A%84%E8%A1%A8%E6%A0%BC
 * @description: title 定义标题数据
 * @description: foot 定义底部数据
 */
const columns = computed(() => {
  const arr = props.columns.map((column, index) => {
    const resize = getResize(column)

    return {
      ellipsis: true,
      ellipsisTitle: true,
      stopPropagation: true,
      ...column,
      attrs: (context: CellData<TableRowData>) => {
        return {
          ...(typeof column.attrs === 'function' ? column.attrs(context) : (column.attrs ?? {})),
          'data-col-index': index,
        }
      },
      resize,
      width: column.width ?? columnWidths.value[index] ?? resize.minWidth,
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

onMounted(() => {
  useMutationObserver(
    vm.exposed!.$el,
    (mutations) => {
      mutations.forEach((item) => {
        const parent =
          item.target instanceof HTMLElement
            ? (item.target.closest('td') ?? item.target.closest('th'))
            : (item.target.parentElement?.closest('td') ?? item.target.parentElement?.closest('th'))

        if (parent !== null && parent !== undefined) {
          const ellipsis = parent.querySelector('.t-table__ellipsis') as HTMLElement | null

          if (ellipsis !== null) {
            const insertWidth = Math.ceil(
              Math.max(ellipsis.offsetWidth, ellipsis.scrollWidth) + 24 + 1,
            )
            const _index = parent.getAttribute('data-col-index')

            if (_index !== null) {
              const index = Number(_index)
              const current = _columnWidths.value[index] ?? columnMinWidths[index]!

              if (insertWidth > current) {
                const finallyInsertWidth = Math.max(
                  Math.min(insertWidth, columnMaxWidths[index]!),
                  columnMinWidths[index]!,
                )

                if (finallyInsertWidth !== current) {
                  console.log('-----------------------------')

                  const arr = [..._columnWidths.value]

                  arr[Number(index)] = finallyInsertWidth
                  _columnWidths.value = arr
                }
              }
            }
          }
        }
      })
    },
    {
      attributeFilter: ['class', 'style'],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    },
  )
})
defineExpose({} as EnhancedTableInstanceFunctions)
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
  --td-font-body-medium: 13px / var(--td-line-height-body-medium) var(--td-font-family);
  /* stylelint-disable-next-line custom-property-pattern */
  --td-comp-paddingTB-m: 6px;
  /* stylelint-disable-next-line custom-property-pattern */
  --td-comp-paddingLR-l: 12px;

  table {
    /* 解决滚动时固定列border消失的bug */
    border-collapse: separate;

    td,
    th {
      height: 45px;
    }

    th,
    thead td {
      font-weight: 600;
      color: inherit;
      background-color: var(--td-brand-color-1) !important;
    }

    tfoot tr {
      background-color: var(--td-brand-color-1) !important;
    }
  }

  /* 滚动条样式 */
  .t-table__content::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  .t-table__content::-webkit-scrollbar-thumb {
    cursor: pointer;
  }

  .t-table__scroll-bar-divider {
    right: 10px !important;
  }

  /* 调整css,以便计算宽度 */
  .t-table__ellipsis {
    display: inline-block;
    width: auto;
    max-width: 100%;
    vertical-align: bottom;
  }
}

.t-table--bordered {
  /* fixed 列的阴影 */
  &.t-table__content--scrollable-to-left {
    :deep() {
      .t-table__cell--fixed-left-last {
        box-shadow: 8px 0 10px -5px rgb(0 0 0 / 12%);

        &::after {
          border-right-width: 1px;
        }
      }
    }
  }

  &.t-table__content--scrollable-to-right {
    :deep() {
      .t-table__cell--fixed-right-first {
        box-shadow: -8px 0 10px -5px rgb(0 0 0 / 12%);

        &::after {
          border-left-width: 1px;
        }
      }
    }
  }
}

.t-table--width-overflow {
  /* 最下面的边框 */
  :deep() {
    tfoot > tr:last-child > td,
    tbody:not(:has(+ tfoot)) > tr:last-child > td {
      border-bottom: 1px solid var(--td-component-border);
    }
  }
}

/* 行背景颜色 */
.t-table--striped {
  :deep() {
    > .t-table__content > table > tbody > tr:nth-of-type(odd):not(.t-table__expanded-row) {
      background-color: var(--td-bg-color-container) !important;
    }

    > .t-table__content > table > tbody > tr:nth-of-type(even):not(.t-table__expanded-row) {
      background-color: var(--td-bg-color-secondarycontainer) !important;
    }
  }

  &.t-table--hoverable {
    :deep() {
      > .t-table__content > table > tbody tr {
        &:hover {
          background-color: var(--td-bg-color-secondarycontainer-hover) !important;
        }
      }
    }
  }
}
</style>
