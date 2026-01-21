<script setup lang="ts">
const config: PageListProps = {
  apis: {
    list: {
      method: 'system/dict/type/list',
    },
  },
  columns: [
    {
      colKey: 'id',
      title: '主键',
    },
    {
      colKey: 'brandId',
      title: '品牌id',
    },
    {
      colKey: 'taskId',
      title: '任务id',
    },
    {
      colKey: 'ticketType',
      title: 'ticket类型1-数据拉取 2-方案',
    },
    {
      colKey: 'ticket',
      title: '微博ticket',
    },
    {
      colKey: 'authorizeCode',
      title: '鉴权码',
    },
    {
      colKey: 'accessToken',
      title: '授权token',
    },
    {
      colKey: 'remark',
      title: '备注',
    },
    {
      colKey: 'offsetNum',
      title: '拉取数据位置标记',
    },
    {
      colKey: 'status',
      title: '状态0-有效1-无效',
    },
    {
      colKey: 'createBy',
      title: '创建人',
    },
    {
      colKey: 'createTime',
      title: '创建时间',
    },
    {
      colKey: 'updateBy',
      title: '更新人',
    },
    {
      colKey: 'updateTime',
      title: '更新时间',
    },
    {
      colKey: 'dataType',
      title: '数据类型1-视频 2-内容 3-其他',
    },
  ],
  formItems: [
    {
      _label: '字典名称',
      model: 'dictName',
    },
    {
      _label: '字典类型',
      model: 'dictType',
    },
    {
      _label: '状态',
      component: 'TSelect',
      dicCode: 'sys_normal_disable',
      model: 'status',
    },
    {
      _class: 'col-span-2',
      _label: '创建时间',
      component: 'TDateRangePicker',
      model: 'dateRange',
    },
  ],
  initialFormData: {
    dateRange: [],
    dictName: '',
    dictType: '',
    status: '',
  },
}
</script>

<template>
  <PageList v-bind="config"></PageList>
</template>
