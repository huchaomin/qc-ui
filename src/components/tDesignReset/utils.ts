export const tablePropsInit = {
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
