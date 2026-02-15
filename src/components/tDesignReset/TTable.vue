<script setup lang="ts">
import type {
  TableCol as _TableCol,
  TableRowData as _TableRowData,
  CellData,
  EnhancedTableInstanceFunctions,
  EnhancedTableProps,
  TNode,
} from 'tdesign-vue-next'
import type { UnwrapRef } from 'vue'
import type { CellObjConfig, CellObjConfigFn } from '@/plugins/tableRenders/cell'
import { mergeProps } from 'vue'
import TCheckboxGroup from '@/components/tDesignReset/TCheckboxGroup.vue'
import { tablePropsInit } from '@/components/tDesignReset/utils'
import { getCellRender } from '@/plugins/tableRenders/cell'

export interface CellRenderContext {
  col: FinallyTableCol
  colIndex: number
  row: TableRowData
  rowIndex: number
}
export type CellRenderFn = TNode<CellRenderContext>
export type TableCol = {
  /**
   * @description: 单元格渲染
   * @description: 渲染方式1(tsx): (h, { col, colIndex, row, rowIndex }) => <div>{row[col.colKey]}</div>
   * @description: 渲染方式2(vue组件): { _component: 'DicLabel', dicCode: 'sys_normal_disable' }
   * @description: 渲染方式3(vue组件，需要行列信息作为参数的):  (h, { col, colIndex, row, rowIndex }) => {
                                                            return {
                                                              _component: 'Link',
                                                              onClick: () => {
                                                                console.log(row, col, colIndex, rowIndex)
                                                              },
                                                            }
                                                          }
   * @description: 渲染方式4(vue组件，需要行列信息作为参数的, 且渲染多个的): {
                                                                              _component: 'Buttons',
                                                                              buttons: [
                                                                                ({ row }) => ({
                                                                                  default: '编辑',
                                                                                  onClick: () => {
                                                                                  },
                                                                                }),
                                                                              ],
                                                                            },
   * @description: 如果想使用插槽的话请使用 colKey 作为插槽名, 注意插槽名称保持 kebab-case 或 camelCase 命名
   */
  cell?: XOR<XOR<CellRenderFn, CellObjConfig>, CellObjConfigFn>
  /**
   * @description: 列的key，必须要存在，且唯一
   */
  colKey: string
  /**
   * @description: 列拖动的最大值最小值，也可用来限制列的宽度（整体宽度不足时展现出来），感觉有bug
   * @return {*}
   */
  resize?: {
    maxWidth?: number
    minWidth?: number
  }
  /**
   * @description: 列的显示与隐藏
   */
  visible?: boolean
  /**
   * @description: 列的宽度，宽度充裕时实际渲染的将比这个值大，可以看作列的最小宽度
   */
  width?: number
} & Omit<_TableCol<TableRowData>, 'cell' | 'colKey' | 'render' | 'resize' | 'width'>
export type TableProps = {
  /**
   * @description: 数据变化时是否检查选中状态，默认 true
   */
  checkSelectedOnDataChange?: boolean
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
   * @description: 是否显示选择列, multiple 多选, single 单选
   */
  showRowSelect?: 'multiple' | 'single'
  /**
   * @description: 是否显示序号列
   */
  showSerialNumber?: boolean
  /**
   * @description: 是否显示全屏按钮
   */
  showToggleFullscreenBtn?: boolean
} & Omit<
  EnhancedTableProps,
  | 'allowResizeColumnWidth'
  | 'columns'
  | 'data'
  | 'defaultSelectedRowKeys'
  | 'fixedRows'
  | 'footerAffixProps'
  | 'headerAffixProps'
  | 'rowKey'
  | 'sortOnRowDraggable'
>
export type TableRowData = _TableRowData

type FinallyTableCol = Omit<
  UnwrapRef<typeof _columns>[number],
  'attrs' | 'cell' | 'resize' | 'width'
> & {
  attrs: (context: CellData<TableRowData>) => {
    [key: string]: any
  }
  cell?: CellRenderFn
  resize: {
    maxWidth: number
    minWidth: number
  }
  width: number
}
type OnSelectChangeParams = Parameters<NonNullable<EnhancedTableProps['onSelectChange']>>
type SelectedRowKeys = Array<number | string>
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TableProps>(), tablePropsInit)
const route = useRoute()

function checkColumns(arr: TableCol[]): string | true {
  const emptyKeyCol = arr.find((c) => isFalsy(c.colKey))

  if (emptyKeyCol !== undefined) {
    return `列的colKey不能为空: ${JSON.stringify(emptyKeyCol)}`
  }

  const repeatKeyCol = arr.find((c, i) => arr.findIndex((c2) => c2.colKey === c.colKey) !== i)

  if (repeatKeyCol !== undefined) {
    return `列的colKey不能重复: ${JSON.stringify(repeatKeyCol)}`
  }

  return true
}

const _columns = computed(() => {
  const result = checkColumns(props.columns)

  if (result !== true) {
    return []
  }

  const arr = props.columns
    .filter((c) => c.visible !== false)
    .map((c) => {
      const obj = {
        ...c,
      }

      delete obj.visible
      return obj as Omit<typeof c, 'visible'>
    })

  if (props.showRowSelect && !arr.some((c) => c.colKey === 'row-select')) {
    const serialIndex = arr.findIndex((c) => c.colKey === 'serial-number')

    arr.splice(serialIndex === -1 ? 0 : serialIndex, 0, {
      colKey: 'row-select',
      title: '选择',
      type: props.showRowSelect,
    })
  }

  if (props.showSerialNumber && !arr.some((c) => c.colKey === 'serial-number')) {
    arr.unshift({
      align: 'center',
      colKey: 'serial-number',
      title: '序号',
    })
  }

  return arr
})

watch(
  () => checkColumns(props.columns),
  (result) => {
    if (result !== true) {
      void $notify.error(result)
    }
  },
  {
    immediate: true,
  },
)

const finallyData = computed<TableRowData[]>(() => {
  return props.data.map((item, index) => {
    return Object.assign(item, {
      _ROW_KEY: _uniqueId(String(index)),
    })
  })
})
const _columnWidths = ref<Record<string, number>>({})
const columnWidths = refDebounced(_columnWidths, 600)
const columnMinWidths = reactive<Record<string, number>>({})
const columnMaxWidths = reactive<Record<string, number>>({})
const columnConfigShows = ref<string[]>([])
const columnConfigOptions = computed(() => {
  return _columns.value
    .filter(
      (c) =>
        !isFalsy(c.title) &&
        !['row-select', 'serial-number'].includes(c.colKey) &&
        !c.colKey.startsWith('_'),
    )
    .map((column) => ({
      label: column.title as string | TNode,
      value: column.colKey,
    }))
})
const columnConfigStorageKey = computed(() => {
  return columnConfigOptions.value.map((c) => c.value).join('_')
})
const columnHides = useLocalStorage<string[]>(columnConfigStorageKey, [])

function getResize(column: TableCol) {
  return {
    maxWidth: column.resize?.maxWidth ?? Infinity,
    minWidth: column.resize?.minWidth ?? 60,
  }
}

watch(
  _columns,
  (cs) => {
    cs.forEach((c) => {
      const resize = getResize(c)

      _columnWidths.value[c.colKey] = resize.minWidth
      columnMinWidths[c.colKey] = resize.minWidth
      columnMaxWidths[c.colKey] = resize.maxWidth
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
const columns = computed<FinallyTableCol[]>(() => {
  const arr = _columns.value
    .filter(
      (c) =>
        (props.showColumnConfigBtn && !columnHides.value.includes(c.colKey)) ||
        !props.showColumnConfigBtn,
    )
    .map((column) => {
      const resize = getResize(column)

      return {
        ellipsis: true,
        ellipsisTitle: true,
        stopPropagation: true,
        ...column,
        attrs: (context: CellData<TableRowData>) => {
          return {
            ...(typeof column.attrs === 'function' ? column.attrs(context) : (column.attrs ?? {})),
            'data-col-key': column.colKey,
          }
        },
        cell: getCellRender(column.cell),
        resize,
        width: (column.width ?? columnWidths.value[column.colKey])!,
      }
    })

  return arr
})

function getRowKey(): string | undefined {
  const arr = props.data

  if (arr.length === 0) {
    return undefined
  }

  const keys = Object.keys(arr[0]!)

  if (keys.includes('id')) {
    return 'id'
  }

  // if (keys.filter((k) => k.endsWith('Id')).length === 1) {
  //   return keys.find((k) => k.endsWith('Id'))!
  // }

  if (keys.includes('key')) {
    return 'key'
  }

  return undefined
}

const otherProps = computed(() => {
  const obj: Partial<TableProps> = {
    ...props,
  }

  obj.rowKey = props.rowKey ?? getRowKey() ?? '_ROW_KEY'
  delete obj.columns
  delete obj.data
  delete obj.showToggleFullscreenBtn
  delete obj.showColumnConfigBtn
  delete obj.flexHeight
  delete obj.checkSelectedOnDataChange
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
  [columnConfigOptions, columnHides],
  ([options, hides]) => {
    columnConfigShows.value = options
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
        modelValue: columnConfigShows.value,
        'onUpdate:modelValue': (value) => {
          // columnConfigShows.value = value as string[]
          columnHides.value = columnConfigOptions.value
            .filter((c) => !value.includes(c.value))
            .map((c) => c.value)
        },
        options: columnConfigOptions.value,
      }),
    closeOnOverlayClick: true,
    dialogClassName: '!min-w-[auto]',
    footer: false,
    header: '请勾选要显示的列',
  })
}

const tableParentRef = useTemplateRef('tableParentRef')
const { height: tableParentHeight } = useElementSize(tableParentRef)
const theadTagRef = ref<HTMLElement | null>(null)
const tbodyTagRef = ref<HTMLElement | null>(null)
const tfootTagRef = ref<HTMLElement | null>(null)
const tableContentRef = ref<HTMLElement | null>(null)
const { height: theadHeight } = useElementSize(theadTagRef)
const { height: tbodyHeight } = useElementSize(tbodyTagRef)
const { height: tfootHeight } = useElementSize(tfootTagRef)
const { height: tableContentHeight } = useElementSize(tableContentRef)
const _tfootTransformY = computed(() => {
  return Math.max(
    0,
    tableContentHeight.value - theadHeight.value - tbodyHeight.value - tfootHeight.value,
  )
})
const tfootTransformY = refDebounced(_tfootTransformY, 100)
const selectedRowKeys = defineModel<SelectedRowKeys>('selectedRowKeys', {
  default: () => [],
})
const compo = _Table
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  if (instance !== null) {
    instance.selectedRows = computed(() =>
      finallyData.value.filter((item) =>
        selectedRowKeys.value.includes(item[otherProps.value.rowKey!]),
      ),
    )
    instance.selectedRowKeys = selectedRowKeys
    instance.rowKey = computed(() => otherProps.value.rowKey!)
  }

  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

/**
 * @description: 初始化时以及列显隐时，fixed 阴影不展示的bug
 */
watch(
  [columnWidths, columnHides],
  () => {
    nextTick(() => {
      vm.exposed!.refreshTable()
    })
  },
  {
    deep: true,
  },
)
onMounted(() => {
  theadTagRef.value = tableParentRef.value!.querySelector('thead')
  tbodyTagRef.value = tableParentRef.value!.querySelector('tbody')
  tfootTagRef.value = tableParentRef.value!.querySelector('tfoot')
  tableContentRef.value = tableParentRef.value!.querySelector('.t-table__content')
  /**
   * @description: col span 的暂时没考虑， footer 的没考虑
   */
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
            const key = parent.getAttribute('data-col-key')

            if (key !== null) {
              const finallyInsertWidth = Math.max(
                Math.min(insertWidth, columnMaxWidths[key]!),
                columnMinWidths[key]!,
              )

              if (finallyInsertWidth > _columnWidths.value[key]!) {
                if (finallyInsertWidth <= parent.offsetWidth) {
                  columnMinWidths[key] = finallyInsertWidth
                } else {
                  _columnWidths.value[key] = finallyInsertWidth
                }
              }
            }
          }
        }
      })
    },
    {
      attributeFilter: ['class', 'style', 'colspan'],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    },
  )
})
onUpdated(() => {
  theadTagRef.value = tableParentRef.value!.querySelector('thead')
  tbodyTagRef.value = tableParentRef.value!.querySelector('tbody')
  tfootTagRef.value = tableParentRef.value!.querySelector('tfoot')
  tableContentRef.value = tableParentRef.value!.querySelector('.t-table__content')
})
onUnmounted(() => {
  if (columnHides.value.length === 0) {
    localStorage.removeItem(columnConfigStorageKey.value)
  }

  theadTagRef.value = null
  tbodyTagRef.value = null
  tfootTagRef.value = null
  tableContentRef.value = null
})
watch(
  () => props.data,
  () => {
    if (!props.checkSelectedOnDataChange) {
      return
    }

    const rowKey = otherProps.value.rowKey!
    const newSelectedRowKeys = selectedRowKeys.value.filter((key) => {
      return props.data.some((item) => item[rowKey] === key)
    })

    if (_difference(selectedRowKeys.value, newSelectedRowKeys).length > 0) {
      selectedRowKeys.value = newSelectedRowKeys
      props.onSelectChange?.(newSelectedRowKeys, {
        currentRowKey: 'DATA_CHANGE',
        selectedRowData: finallyData.value.filter((item) =>
          newSelectedRowKeys.includes(item[rowKey]),
        ),
        type: 'uncheck',
      })
    }
  },
  {
    deep: 2,
  },
)
defineExpose(
  {} as {
    rowKey: ComputedRef<string>
    // 如果初始化提供的 selectedRowKeys 在 data 中找不到，或者 checkSelectedOnDataChange 为 false, selectedRowKeys 会比 selectedRows 选的多
    selectedRowKeys: Ref<SelectedRowKeys>
    selectedRows: ComputedRef<TableRowData[]>
  } & EnhancedTableInstanceFunctions,
)
</script>

<template>
  <Teleport :disabled="!isFullscreen" to="#app">
    <div
      class="flex w-full flex-col gap-3"
      :class="{
        'overflow-y-auto': flexHeight || isFullscreen,
        'full_screen bg-(--td-bg-color-container) p-4': isFullscreen,
        transform_tfoot: tfootTransformY > 0,
      }"
      v-bind="$attrs"
    >
      <div class="table_operations_wrapper items-end justify-end gap-3">
        <div class="flex flex-1 items-end">
          <slot name="table-operations" v-bind="{ columns, data: finallyData }"></slot>
        </div>
        <TTooltip v-if="showColumnConfigBtn" content="列显示配置">
          <TButton shape="square" variant="outline" @click="handleColumnHideConfig">
            <template #icon>
              <Icon icon="mingcute:column-line"></Icon>
            </template>
          </TButton>
        </TTooltip>
        <TTooltip v-if="showToggleFullscreenBtn" :content="isFullscreen ? '退出全屏' : '全屏显示'">
          <TButton
            class="ml-0!"
            shape="square"
            variant="outline"
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
      <slot name="table-top" v-bind="{ columns, data: finallyData }"></slot>
      <div
        ref="tableParentRef"
        class="table_parent"
        :class="{ 'flex-1 overflow-y-hidden': flexHeight || isFullscreen }"
      >
        <component
          :is="
            h(
              compo,
              mergeProps(
                {},
                {
                  ...otherProps,
                  ref: compoRef,
                  columns,
                  data: finallyData,
                  height: flexHeight || isFullscreen ? tableParentHeight : otherProps.height,
                  maxHeight: flexHeight || isFullscreen ? undefined : otherProps.maxHeight,
                  resizable: otherProps.bordered ? otherProps.resizable : false,
                  selectedRowKeys,
                  onSelectChange: (...args: OnSelectChangeParams) => {
                    selectedRowKeys = args[0]
                    props.onSelectChange?.(...args)
                  },
                },
              ),
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
      <slot name="table-bottom" v-bind="{ columns, data: finallyData }"></slot>
    </div>
  </Teleport>
</template>

<style scoped>
:deep() {
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

    .t-table__cell-check {
      text-align: center;
    }

    tfoot {
      tr {
        background-color: var(--td-gray-color-2) !important;
      }
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
    top: -1px;
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

.t-table {
  --td-font-body-medium: 13px / var(--td-line-height-body-medium) var(--td-font-family);
  /* stylelint-disable-next-line custom-property-pattern */
  --td-comp-paddingTB-m: 0;
  /* stylelint-disable-next-line custom-property-pattern */
  --td-comp-paddingLR-l: 12px;

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
    .t-table__empty {
      position: absolute;
      /* stylelint-disable-next-line value-keyword-case */
      inset: calc(v-bind(theadHeight) * 1px + 12px) 12px 12px;
      width: auto !important;
      pointer-events: none;
    }

    .t-table__content:has(.t-table__empty),
    td:has(.t-table__empty) {
      position: static;
    }
  }
}

.table_parent {
  /* stylelint-disable-next-line value-keyword-case */
  min-height: calc(v-bind(theadHeight) * 1px + v-bind(tfootHeight) * 1px + 46px);

  &:has(.t-table--width-overflow) {
    /* stylelint-disable-next-line value-keyword-case */
    min-height: calc(v-bind(theadHeight) * 1px + v-bind(tfootHeight) * 1px + 56px);
  }

  &:has(.t-table__empty) {
    /* stylelint-disable-next-line value-keyword-case */
    min-height: calc(v-bind(theadHeight) * 1px + 144px);

    :deep() {
      .t-table__footer {
        display: none;
      }

      .t-table,
      .t-table__content {
        min-height: inherit;
      }
    }
  }
}

.t-table--bordered {
  /* 最下面的边框 */
  &::after {
    position: absolute;
    right: 2px;
    bottom: 1px;
    left: 2px;
    z-index: 32; /* fixed left 30, right 31  */
    display: block;
    content: '';
    border-bottom: 1px solid var(--td-component-border);
  }

  :deep() {
    /* 最下面的边框 */
    tfoot > tr:last-child > td,
    tbody > tr:last-child:not(.t-table__empty-row) > td {
      border-bottom: 1px solid var(--td-component-border);
    }

    tfoot {
      /* stylelint-disable-next-line no-descending-specificity */
      > tr:first-child > td {
        border-top: none;
      }

      &::before {
        position: absolute;
        top: -1px;
        left: 0;
        z-index: 1;
        width: 100%;
        content: '';
        border-bottom: 1px solid var(--td-component-border);
      }
    }

    /* stylelint-disable-next-line no-descending-specificity */
    .t-table__content {
      border-bottom-color: transparent;
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
      > .t-table__content > table > tbody tr:not(.t-table__empty-row) {
        &:hover {
          background-color: var(--td-bg-color-secondarycontainer-hover) !important;
        }
      }
    }
  }
}

.table_operations_wrapper {
  display: none;

  &:has(> *:not(:empty)) {
    display: flex;
  }
}

.transform_tfoot {
  :deep() {
    tfoot {
      /* stylelint-disable-next-line value-keyword-case */
      transform: translateY(calc(v-bind(tfootTransformY) * 1px));
    }
  }
}
</style>
