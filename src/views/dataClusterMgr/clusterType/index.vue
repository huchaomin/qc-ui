<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  sortOrder: {
    _label: '排序',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'sortOrder',
    theme: 'row',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
  typeCode: {
    _label: '类型编码',
    _required: true,
    model: 'typeCode',
  },
  typeDesc: {
    _class: 'col-span-full',
    _label: '类型描述',
    model: 'typeDesc',
  },
  typeName: {
    _label: '类型名称',
    _required: true,
    model: 'typeName',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/clusterType',
      permission: 'yq:clusterType:remove',
    },
    export: {
      method: 'yq/clusterType/export',
      permission: 'yq:clusterType:export',
    },
    list: {
      method: 'yq/clusterType/list',
    },
  },
  columns: [
    {
      colKey: 'typeCode',
      title: '类型编码',
    },
    useClusterTypeNameColumn(),
    {
      colKey: 'typeDesc',
      title: '类型描述',
    },
    {
      colKey: 'sortOrder',
      title: '排序',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'status',
      },
      colKey: 'status',
      title: '状态',
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
      cell: {
        _component: 'Buttons',
        buttons: [
          ({ row }) => ({
            default: '编辑',
            onClick: () => {
              const formRef = ref<FormInstance | null>(null)

              watch(
                formRef,
                () => {
                  formRef.value!.setFormData(row)
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () =>
                  h(TForm, {
                    items: [
                      {
                        ...formItemMap.typeCode,
                        disabled: true,
                      },
                      formItemMap.typeName,
                      formItemMap.typeDesc,
                      formItemMap.sortOrder,
                      {
                        ...formItemMap.status,
                        component: 'TRadioGroup',
                      },
                    ],
                    ref: formRef,
                  }),
                header: '修改聚类类型',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/clusterType', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('聚类类型修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:clusterType:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.typeCode,
    formItemMap.typeName,
    {
      ...formItemMap.status,
      component: 'TSelect',
    },
  ],
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(TForm, {
              data: reactive({
                status: '0',
              }),
              items: [
                formItemMap.typeCode,
                formItemMap.typeName,
                formItemMap.typeDesc,
                formItemMap.sortOrder,
                {
                  ...formItemMap.status,
                  component: 'TRadioGroup',
                },
              ],
              ref: formRef,
            }),
          header: '新增聚类类型',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/clusterType', await formRef.value!.validate())
            $msg.success('聚类类型新增成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:clusterType:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
