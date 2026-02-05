<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
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
      colKey: 'row-select',
      type: 'multiple',
    },
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
      cell: (_, { row }) => {
        return {
          _component: 'Buttons',
          buttons: [
            {
              default: '编辑',
            },
            {
              default: '删除',
              permission: 'system:dict:remove',
              popconfirm: {
                content: '确认删除吗',
                onConfirm: async () => {
                  await alovaInst.Delete(`system/dict/type/${row.dictId}`)
                  $msg.success('删除成功')
                  pageListRef.value!.query()
                },
              },
            },
          ],
        }
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
  initialFormData: {
    dateRange: [],
    dictName: '',
    dictType: '',
    status: '',
  },
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
    reactive({
      default: '批量删除',
      disabled: computed(() => (pageListRef.value?.selectedRows ?? []).length === 0),
      onClick: async () => {
        await $confirm('确认删除所选项吗?')
        await alovaInst.Delete(
          `system/dict/type/${pageListRef.value!.selectedRows.map((item) => item.dictId).join(',')}`,
        )
        $msg.success('删除成功')
        pageListRef.value!.query()
      },
      permission: 'system:dict:remove',
    }),
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
