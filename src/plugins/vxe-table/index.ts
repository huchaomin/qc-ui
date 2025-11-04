import { VxeTooltip } from 'vxe-pc-ui'
import { VxeGrid, VxeUI } from 'vxe-table'
import 'vxe-table/lib/style.min.css'
import 'vxe-pc-ui/lib/style.min.css'

VxeUI.setConfig({
  table: {
    border: 'full',
    columnConfig: {
      // autoOptions: {
      //   isCalcBody: true,
      //   isCalcFooter: true,
      //   isCalcHeader: true, // 无效
      // },
      // maxWidth: 500, // 无效 4.16.12
      minWidth: 100, // width 生效时该属性不生效
      resizable: true,
      // width: 'auto', // 需要注意，由于虚拟滚动是可视区渲染的，所以自适应列宽功能不支持虚拟滚动，需要关闭虚拟滚动才能使用
    },
    minHeight: 0,
    resizableConfig: {
      minWidth: 100,
    },
    rowConfig: {
      isHover: true,
    },
    showFooterOverflow: 'tooltip',
    showHeaderOverflow: 'tooltip',
    showOverflow: 'tooltip',
    size: 'medium',
    sortConfig: {
      orders: ['desc', 'asc'],
      trigger: 'cell',
    },
    stripe: true,
    tooltipConfig: {
      enterable: true,
    },
    treeConfig: {
      indent: 0,
      parentField: 'parentId',
      rowField: 'id',
      showIcon: false, // 是否显示图标，使用自己定义的
      trigger: 'cell',
    },
  },
})
VxeUI.component(VxeTooltip)

export default VxeGrid
