import type {
  TableCol as _TableCol,
  TableRowData as _TableRowData,
  EnhancedTableProps,
  TNode,
} from 'tdesign-vue-next'
import type { CellConfigFn, CellConfigObj } from '@/plugins/tableRenders/cell'
import type { TitleConfigFn, TitleConfigObj } from '@/plugins/tableRenders/title'

export interface CellRenderContext {
  col: FinallyTableCol
  colIndex: number
  row: TableRowData
  rowIndex: number
}
export type FinallyTableCol = Omit<TableCol, 'cell' | 'resize' | 'title' | 'visible' | 'width'> & {
  cell: TNodeFn
  resize: {
    maxWidth: number
    minWidth: number
  }
  title: TitleTNodeFn
  width: number
}
export type OnSelectChangeParams = Parameters<NonNullable<EnhancedTableProps['onSelectChange']>>
export type SelectedRowKeys = Array<number | string>
export type TableCol = {
  /**
   * @description: 单元格渲染
   * @description: 渲染方式1(CellConfigFn 函数): (h, { col, colIndex, row, rowIndex }) => <div>{row[col.colKey]}</div>
   * @description: 渲染方式2(CellConfigObj vue组件): { _component: 'DicLabel', dicCode: 'sys_normal_disable' }
   * @description: 渲染方式3(CellConfigFn vue组件，需要行列信息作为参数的):  (h, { col, colIndex, row, rowIndex }) => {
                                                            return {
                                                              _component: 'Link',
                                                              onClick: () => {
                                                                console.log(row, col, colIndex, rowIndex)
                                                              },
                                                            }
                                                          }
   * @description: 渲染方式4(vue组件，需要行列信息作为参数的, 且渲染多个的，暂时只有 Buttons): {
                                                                              _component: 'Buttons',
                                                                              buttons: [
                                                                                ({ row }) => ({
                                                                                  default: '编辑',
                                                                                  onClick: () => {
                                                                                  },
                                                                                }),
                                                                              ],
                                                                            },
   */
  cell?: CellConfigFn | CellConfigObj | TNodeFn
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
  title?: string | TitleConfigFn | TitleConfigObj | TitleTNodeFn
  /**
   * @description: 列的显示与隐藏
   */
  visible?: boolean
} & Omit<
  _TableCol<TableRowData>,
  'cell' | 'colKey' | 'ellipsis' | 'ellipsisTitle' | 'render' | 'resize' | 'title' | 'width'
>
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
  | 'onTreeExpandChange' // 废弃，请使用 onExpandedTreeNodesChange
  | 'rowKey'
  | 'sortOnRowDraggable'
  | 'treeExpandAndFoldIcon' // 全局中定义
>
export type TableRowData = _TableRowData
export interface TitleRenderContext {
  col: FinallyTableCol
  colIndex: number
}
export type TitleTNodeFn = TNode<TitleRenderContext>
export type TNodeFn = TNode<CellRenderContext>
