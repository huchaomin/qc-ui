<script setup lang="ts">
const config: PageListConfigType = {
  apis: {
    list: {
      method: 'yq/wbTaskCfg/list',
    },
  },
  columns: [
    {
      colKey: 'id',
      fixed: 'left',
      title: '主键',
      width: 200,
    },
    {
      colKey: 'brandId',
      fixed: 'left',
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
  formProps: {
    data: {
      accessToken: '',
      authorizeCode: '',
      brandId: '',
      dataType: '',
      offsetNum: '',
      status: '',
      taskId: '',
      ticket: '',
      ticketType: '',
    },
    items: [
      {
        _label: '品牌id',
        model: 'brandId',
      },
      {
        _label: '任务id',
        model: 'taskId',
      },
      {
        _label: 'ticket类型',
        component: 'TSelect',
        dicCode: 'ticket_type',
        model: 'ticketType',
      },
      {
        _label: '微博ticket',
        model: 'ticket',
      },
      {
        _label: '鉴权码',
        model: 'authorizeCode',
      },
      {
        _label: '授权token',
        model: 'accessToken',
      },
      {
        _label: '拉取数据位置标记',
        model: 'offsetNum',
      },
      {
        _label: '状态',
        component: 'TSelect',
        dicCode: 'status',
        model: 'status',
      },
      {
        _label: '数据类型',
        component: 'TSelect',
        dicCode: 'data_type',
        model: 'dataType',
      },
    ],
  },
}
</script>

<template>
  <PageList v-bind="config"></PageList>
</template>
