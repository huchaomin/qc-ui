<script setup lang="ts">
const config: PageListProps = {
  apis: {
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('system/dict/type/list', {
          params: {
            ...o,
            dateRange: undefined,
            'params[beginTime]': o.dateRange[0] ?? '',
            'params[endTime]': o.dateRange[1] ?? '',
          },
        })
      },
    },
  },
  columns: [
    {
      colKey: 'dictId',
      title: '字典编号',
    },
    {
      colKey: 'dictName',
      title: '字典名称',
    },
    {
      cell: (_, { row }) => {
        return {
          _component: 'Link',
          onClick: () => {
            console.log(row)
          },
        }
      },
      colKey: 'dictType',
      title: '字典类型',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'sys_normal_disable',
      },
      colKey: 'status',
      title: '状态',
    },
    {
      colKey: 'remark',
      title: '备注',
    },
    {
      colKey: 'createBy',
      title: '创建人',
    },
    {
      colKey: 'createTime',
      title: '创建时间',
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
  <PageList v-bind="config"> </PageList>
</template>
