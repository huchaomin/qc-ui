<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const config: PageListProps = {
  apis: {
    delete: {
      method: (rows: TableRowData[]) => {
        return alovaInst.Delete(`system/dict/type/${rows.map((item) => item.dictId).join(',')}`)
      },
      permission: 'system:dict:remove',
    },
    export: {
      method: 'system/dict/type/export',
      permission: 'system:dict:export',
    },
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
    {
      cell: {
        _component: 'Buttons',
        buttons: [
          {
            default: '编辑',
          },
        ],
      },
      colKey: '_operation',
      title: '操作',
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
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                dictId: '',
                dictName: '',
                dictType: '',
                remark: '',
                status: '0',
              }),
              items: [
                {
                  _label: '字典名称',
                  _required: true,
                  model: 'dictName',
                },
                {
                  _label: '字典类型',
                  _required: true,
                  model: 'dictType',
                },
                {
                  _label: '状态',
                  component: 'TRadioGroup',
                  dicCode: 'sys_normal_disable',
                  model: 'status',
                },
                {
                  _label: '备注',
                  component: 'TTextarea',
                  model: 'remark',
                },
              ],
              labelAlign: 'right',
              layout: 'vertical',
              ref: formRef,
            }),
          header: '添加字典类型',
          onConfirmCallback: async () => {
            await alovaInst.Post('system/dict/type', await formRef.value!.validate())
            $msg.success('字典添加成功')
            pageListRef.value!.query()
          },
          width: 430,
        })
      },
      permission: 'system:dict:add',
    },
    {
      default: '刷新缓存',
      onClick: async () => {
        await alovaInst.Delete('system/dict/type/refreshCache', undefined, {
          meta: {
            useSuccessMsg: true,
          },
        })
        pageListRef.value!.query()
      },
      permission: 'system:dict:remove',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
