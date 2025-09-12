<script setup lang="ts">
import type { TYPES } from '@visactor/vtable'
import { themes } from '@visactor/vtable'
import { ListTable } from '@visactor/vue-vtable'

const option: TYPES.ListTableConstructorOptions = {
  allowFrozenColCount: 0, // 前多少列展示 可冻结的图标
  animationAppear: {
    duration: 30,
    type: 'one-by-one',
  },
  autoFillHeight: false, // 控制的是只有当行数较少的时候，表格可以自动撑满容器高度，但是当行数超过容器的时候根据真实情况来定行高可出现滚动条
  autoFillWidth: true,
  columns: [
    {
      field: 'name',
      title: '名称',
    },
    {
      field: 'age',
      title: '年龄',
    },
    {
      field: 'gender',
      title: '性别',
    },
    {
      field: 'hobby',
      title: '爱好',
    },
    {
      field: 'edit',
      title: '操作1',
    },
    {
      field: 'delete',
      title: '操作2',
    },
    {
      field: 'view',
      title: '操作3',
    },
  ],
  columnWidthComputeMode: 'normal',
  defaultHeaderRowHeight: 44,
  defaultRowHeight: 44,
  dragHeaderMode: 'none', // 不拖拽表头换位
  frozenColCount: 2, // 冻结列数，默认为 0。
  heightMode: 'standard',
  hover: {
    disableHeaderHover: true,
    highlightMode: 'row',
  },
  limitMaxAutoWidth: 480,
  limitMinWidth: 80,
  records: Array.from({ length: 1000 }).fill({
    age: 18,
    delete:
      '删除assssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
    edit: '编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑编辑',
    gender: '男',
    hobby: '🏀',
    name: '张三sddddddddddf sdfasdfasd fasdfasdfs张三sddddddddddf sdfasdfasd fasdfasdfs',
    view: '查看',
  }),
  resize: {
    columnResizeMode: 'header', // 表头调整列宽
    disableDblclickAutoResizeColWidth: true, // 取消双击自动列宽
    rowResizeMode: 'none', // 禁止调整行高
  },
  rightFrozenColCount: 0, // 右侧冻结列数，默认为 0。
  rowSeriesNumber: {
    headerStyle: {
      bgColor: 'pink',
      color: 'black',
    },
    style: {
      color: 'red',
    },
    title: '序号',
    width: 'auto',
  },
  select: {
    disableSelect: true,
    highlightMode: 'row', // 可以配置为'cross' 或者 'row' 或者 'column'
  },
  theme: themes.ARCO.extends({
    frameStyle: {
      shadowBlur: 0,
    },
    scrollStyle: {
      visible: 'always',
    },
  }),
  widthMode: 'autoWidth',
}

// columns: [
//     {
//       // ...其他配置项
//       maxWidth: 320,
//       minWidth: 100
//     }
//   ]
</script>

<template>
  <ListTable :options="option" />
</template>
