<script lang="ts">
import type {
  TableCol as _TableCol,
  CellData,
  EnhancedTableInstanceFunctions,
  EnhancedTableProps,
  TableRowData,
  TNode,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'
import TCheckboxGroup from '@/components/tDesignReset/TCheckboxGroup.vue'

export const propsInit = {
  bordered: true,
  disableDataPage: true,
  disableSpaceInactiveRow: true,
  flexHeight: false,
  hover: true,
  lazyLoad: true, // 开启整个表格的懒加载
  maxHeight: 507,
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
  showToggleFullscreenBtn: false,
  stripe: true,
  tableLayout: 'fixed',
} as const

export type TableCol = {
  colKey: string
  /**
   * @description: 列拖动的最大值最小值，感觉有bug
   * @return {*}
   */
  resize?: {
    maxWidth?: number
    minWidth?: number
  }
} & Omit<_TableCol<TableRowData>, 'colKey' | 'resize'>

export type TableProps = {
  columns: Array<TableCol>
  data: Array<TableRowData>
  /**
   * @description: 表格高度是否 flex-1 自适应
   */
  flexHeight?: boolean
  rowKey?: string
  /**
   * @description: 是否显示列配置按钮
   */
  showColumnConfigBtn?: boolean
  /**
   * @description: 是否显示全屏按钮
   */
  showToggleFullscreenBtn?: boolean
} & Omit<
  EnhancedTableProps,
  | 'allowResizeColumnWidth'
  | 'columns'
  | 'data'
  | 'fixedRows'
  | 'footerAffixProps'
  | 'headerAffixProps'
  | 'rowKey'
  | 'sortOnRowDraggable'
>
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TableProps>(), propsInit)
const route = useRoute()
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
const columnsShows = ref<string[]>([])
const tableOperationsRef = useTemplateRef('tableOperationsRef')
const columnOptions = computed(() => {
  return props.columns
    .filter((c) => !isFalsy(c.colKey) && !isFalsy(c.title))
    .map((column) => ({
      label: column.title as string | TNode,
      value: column.colKey,
    }))
})
const columnConfigStorageKey = computed(() => {
  return columnOptions.value.map((c) => c.value).join('_')
})
const columnHides = useLocalStorage<string[]>(columnConfigStorageKey, [])

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
  const arr = props.columns
    .filter(
      (c) =>
        (props.showColumnConfigBtn && !columnHides.value.includes(c.colKey)) ||
        !props.showColumnConfigBtn,
    )
    .map((column, index) => {
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

  return arr
})
const otherProps = computed(() => {
  const obj: Partial<TableProps> = {
    ...props,
  }

  delete obj.columns
  delete obj.data
  delete obj.showToggleFullscreenBtn
  delete obj.showColumnConfigBtn
  delete obj.flexHeight
  // 解决点击row报错的问题
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const isFullscreen = ref(false)

watch(
  () => route.name,
  () => {
    isFullscreen.value = false
  },
)
watch(
  [columnOptions, columnHides],
  ([options, hides]) => {
    columnsShows.value = options
      .filter((c) => !hides.includes(c.value))
      .map((column) => column.value)
  },
  {
    immediate: true,
  },
)

function handleColumnHideConfig() {
  $dialog({
    body: () =>
      h(TCheckboxGroup, {
        class: 'flex-col',
        modelValue: columnsShows.value,
        'onUpdate:modelValue': (value) => {
          columnsShows.value = value as string[]
          columnHides.value = columnOptions.value
            .filter((c) => !value.includes(c.value))
            .map((c) => c.value)
        },
        options: columnOptions.value,
      }),
    closeOnOverlayClick: true,
    dialogClassName: '!min-w-[auto]',
    footer: false,
    header: '请勾选要显示的列',
  })
}

const tableParentRef = useTemplateRef('tableParentRef')
const { height: tableParentHeight } = useElementSize(tableParentRef)
const tableContentRef = ref<HTMLElement | null>(null)
const { height: tableContentHeight } = useElementSize(tableContentRef, undefined, {
  box: 'border-box',
})
const compo = _Table
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

onMounted(() => {
  tableContentRef.value = tableParentRef.value!.querySelector('table')
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
onUpdated(() => {
  tableContentRef.value = tableParentRef.value!.querySelector('table')
})
onUnmounted(() => {
  if (columnHides.value.length === 0) {
    localStorage.removeItem(columnConfigStorageKey.value)
  }
})
defineExpose({} as EnhancedTableInstanceFunctions)
</script>

<template>
  <Teleport :disabled="!isFullscreen" to="#app">
    <div
      class="flex w-full flex-col gap-3"
      :class="{
        'overflow-y-auto': flexHeight || isFullscreen,
        'full_screen bg-[var(--td-bg-color-container)] p-4': isFullscreen,
      }"
      v-bind="$attrs"
    >
      <div
        v-if="
          showColumnConfigBtn ||
          showToggleFullscreenBtn ||
          ($slots['table-operations'] && tableOperationsRef)
        "
        class="flex items-end"
      >
        <slot ref="tableOperationsRef" name="table-operations" v-bind="{ columns, data }"></slot>
        <TTooltip v-if="showColumnConfigBtn" content="列显示配置">
          <TButton
            shape="square"
            variant="outline"
            class="!ml-auto"
            @click="handleColumnHideConfig"
          >
            <template #icon>
              <Icon icon="mingcute:column-line"></Icon>
            </template>
          </TButton>
        </TTooltip>
        <TTooltip v-if="showToggleFullscreenBtn" :content="isFullscreen ? '退出全屏' : '全屏显示'">
          <TButton
            shape="square"
            variant="outline"
            :class="{
              '!ml-auto': !showColumnConfigBtn,
            }"
            @click="isFullscreen = !isFullscreen"
          >
            <template #icon>
              <Icon
                :icon="isFullscreen ? 'lsicon:screen-off-filled' : 'lsicon:fit-screen-outline'"
              ></Icon>
            </template>
          </TButton>
        </TTooltip>
      </div>
      <slot name="table-top" v-bind="{ columns, data }"></slot>
      <div ref="tableParentRef" :class="{ 'flex-1 overflow-y-auto': flexHeight || isFullscreen }">
        <component
          :is="
            h(
              compo,
              mergeProps(otherProps, {
                ref: compoRef,
                columns,
                data,
                height: flexHeight || isFullscreen ? tableParentHeight : otherProps.height,
                maxHeight: flexHeight || isFullscreen ? undefined : otherProps.maxHeight,
                class: {
                  no_blank_spaces: tableContentHeight + 2 >= tableParentHeight,
                },
                resizable: otherProps.bordered ? otherProps.resizable : false,
              }),
            )
          "
        >
          <template v-for="k in Object.keys($slots)" :key="k" #[k]="slotScope">
            <slot :name="k" v-bind="slotScope"></slot>
          </template>
          <template #empty>
            <TEmpty></TEmpty>
          </template>
        </component>
      </div>
      <slot name="table-bottom" v-bind="{ columns, data }"></slot>
    </div>
  </Teleport>
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

.no_blank_spaces {
  :deep() {
    .t-table__content {
      border-bottom-color: transparent;
    }
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

  :deep() {
    /* 最下面的边框 */
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
