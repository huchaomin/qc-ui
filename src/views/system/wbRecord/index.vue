<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
// return [
//     {
//       model: 'data',
//       props: {
//         label: '记录数据',
//       },
//     },
//     {
//       model: 'ticket',
//       props: {
//         label: '微博拉取ticket',
//       },
//     },
//     {
//       model: 'contentId',
//       props: {
//         label: '内容id',
//       },
//     },
//     {
//       model: 'status',
//       props: {
//         label: '状态',
//         options: $dicStore('wb_status').value,
//       },
//       component: 'CRadio',
//     },
//     {
//       model: 'errorMsg',
//       props: {
//         label: '错误信息',
//       },
//     },
//     {
//       model: 'ticketType',
//       props: {
//         label: '标识类型',
//         options: $dicStore('data_type').value,
//       },
//       component: 'CSelect',
//     },
//     {
//       model: 'dataTicket',
//       props: {
//         label: '数据ticket',
//       },
//     },
//     {
//       model: 'brandId',
//       props: {
//         label: '品牌',
//         options: brandOptions.value,
//       },
//       component: 'CSelect',
//     },
//   ]
const formItemMap = {
  brandId: {
    _label: '品牌id',
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  contentId: {
    _label: '内容id',
    model: 'contentId',
  },
  data: {
    _label: '记录数据',
    model: 'data',
  },
  dataTicket: {
    _label: '数据ticket',
    model: 'dataTicket',
  },
  errorMsg: {
    _label: '错误信息',
    model: 'errorMsg',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'wb_status',
    model: 'status',
  },
  ticket: {
    _label: '微博拉取ticket',
    model: 'ticket',
  },
  ticketType: {
    _label: '标识类型',
    component: 'TSelect',
    dicCode: 'data_type',
    model: 'ticketType',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/wbRecord',
      permission: 'yq:wbRecord:remove',
    },
    export: {
      method: 'yq/wbRecord/export',
      permission: 'yq:wbRecord:export',
    },
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('yq/wbRecord/list', {
          params: {
            ...o,
            createTime: undefined,
            createTimeEnd: o.createTime[1] ?? '',
            createTimeStart: o.createTime[0] ?? '',
          },
        })
      },
    },
  },
  columns: [
    {
      colKey: 'id',
      title: '主键',
    },
    {
      cell: (_, { row }) => {
        return JSON.stringify(row.data)
      },
      colKey: 'data',
      title: '记录数据',
      width: 300,
    },
    {
      colKey: 'ticket',
      title: '微博拉取ticket',
    },
    {
      colKey: 'contentId',
      title: '内容id',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'wb_status',
      },
      colKey: 'status',
      title: '状态',
    },
    {
      colKey: 'errorMsg',
      title: '错误信息',
    },
    {
      colKey: 'createTime',
      title: '创建时间',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'data_type',
      },
      colKey: 'ticketType',
      title: '标识类型',
    },
    {
      colKey: 'dataTicket',
      title: '数据ticket',
    },
    {
      colKey: 'brandId',
      title: '品牌id',
    },
  ],
  formItems: [
    formItemMap.contentId,
    {
      ...formItemMap.status,
      component: 'TSelect',
    },
    formItemMap.errorMsg,
    formItemMap.ticketType,
    formItemMap.dataTicket,
    formItemMap.brandId,
    {
      _label: '创建时间',
      component: 'TDateRangePicker',
      model: 'createTime',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
