import type { TreeNodeModel, TreeOptionData } from 'tdesign-vue-next'
import Icon from '../autoImport/Icon.vue'
import Button from './TButton.vue'

export const tablePropsInit = {
  bordered: true,
  checkSelectedOnDataChange: true,
  disableDataPage: true,
  disableSpaceInactiveRow: true,
  flexHeight: false,
  hover: true,
  lazyLoad: true, // 开启整个表格的懒加载
  maxHeight: 507,
  resizable: true,
  rowSelectionAllowUncheck: false, // 行选中单选场景，是否允许取消选中
  scroll: () => ({
    isFixedRowHeight: true,
    rowHeight: 45,
    threshold: 500,
    type: 'virtual' as const,
  }),
  selectOnRowClick: true,
  showHeader: true,
  showSerialNumber: true,
  showToggleFullscreenBtn: false,
  stripe: true,
  tableLayout: 'fixed',
  tree: () => ({
    indent: 41,
    treeNodeColumnIndex: 0,
  }), // 解决表格报错问题
} as const
export const linkPropsInit = {
  theme: 'primary',
} as const
export const buttonPropsInit = {
  autoIcon: true,
  show: true,
} as const
export const formPropsInit = {
  autoLabelWidth: true,
  colon: true,
  data: () => reactive({}),
  labelAlign: 'top',
  layout: 'inline',
  msgErrorWhenValidate: true,
  preventSubmitDefault: true,
  requiredMark: undefined,
  resetType: 'initial',
  showErrorMessage: true,
} as const
export const cardPropsInit = {
  bodyFullHeight: false,
  headerBordered: true,
  shadow: true,
  titleEllipsis: false,
} as const
export const switchPropsInit = {
  disabled: undefined,
  size: 'large',
} as const
export const treePropsInit = {
  checkable: false,
  disabled: undefined,
  expandOnClickNode: undefined,
  hover: true,
  icon: () => (h: typeof import('vue').h, node: TreeNodeModel<TreeOptionData>) => {
    let iconName = ''

    // node.children is undefined on some cases
    // eslint-disable-next-line ts/strict-boolean-expressions
    if (node.getChildren && node.getChildren(false)) {
      if (node.expanded) {
        iconName = 'line-md:chevron-down-circle'

        if (node.loading) {
          iconName = 'line-md:loading-twotone-loop'
        }
      } else {
        iconName = 'line-md:chevron-right-circle'
      }
    }

    if (iconName === '') {
      return null
    }

    return h(
      Button,
      {
        shape: 'circle',
        style: 'font-size: 20px;',
        variant: 'text',
      },
      {
        icon: () => h(Icon, { icon: iconName }),
      },
    )
  },
  label: true,
  lazy: true,
  line: true,
  transition: true,
  valueMode: 'all',
} as const
export const inputPropsInit = {
  autocomplete: 'off',
  clearable: true,
  disabled: undefined,
  placeholder: '请输入',
  readonly: undefined,
} as const
export const selectPropsInit = {
  clearable: true,
  disabled: undefined,
  filterable: true,
  inputValue: undefined,
  keys: () => ({
    disabled: 'disabled',
    label: 'label',
    value: 'value',
  }),
  minCollapsedNum: 1,
  /**
   * @description: 是否多选
   */
  multiple: false,
  placeholder: '请选择',
  /**
   * @description: 是否显示下拉框
   */
  popupVisible: undefined,
  readonly: undefined,
  /**
   * @description: 阈值 大于等于 150 时，启用虚拟滚动
   */
  scroll: () => ({
    threshold: 150,
    type: 'virtual' as const,
  }),
  /**
   * @description: 是否显示右侧箭头
   */
  showArrow: true,
  /**
   * @description: 是否显示全选
   */
  showCheckAll: false,
} as const
export const inputNumberPropsInit = {
  autoWidth: undefined,
  decimalPlaces: 2,
  disabled: undefined,
  min: 0,
  readonly: undefined,
  theme: 'normal',
  useGrouping: true,
} as const
