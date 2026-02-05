export const tablePropsInit = {
  bordered: true,
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
  showToggleFullscreenBtn: false,
  stripe: true,
  tableLayout: 'fixed',
  tree: () => ({}), // 解决表格报错问题
} as const

export const linkPropsInit = {
  theme: 'primary',
} as const

export const buttonPropsInit = {} as const

export const formPropsInit = {
  colon: true,
  labelAlign: 'top',
  layout: 'inline',
  msgErrorWhenValidate: true,
  preventSubmitDefault: true,
  requiredMark: undefined,
  resetType: 'initial',
  showErrorMessage: true,
} as const
