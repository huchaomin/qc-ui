<script setup lang="ts">
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
            createTimeEnd: o.createTime[1]
              ? dayjs(o.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
              : '',
            createTimeStart: o.createTime[0]
              ? dayjs(o.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
              : '',
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
      cell: {
        _component: 'OptionLabel',
        multiple: true,
        options: 'brand',
      },
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
  <PageList v-bind="config"></PageList>
</template>
