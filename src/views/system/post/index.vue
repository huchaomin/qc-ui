<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  postCode: {
    _label: '岗位编码',
    _required: true,
    model: 'postCode',
  },
  postName: {
    _label: '岗位名称',
    _required: true,
    model: 'postName',
  },
  postSort: {
    _label: '岗位顺序',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'postSort',
    theme: 'row',
  },
  remark: {
    _label: '备注',
    component: 'TTextarea',
    model: 'remark',
  },
  status: {
    _label: '状态',
    component: 'TSelect',
    dicCode: 'sys_normal_disable',
    model: 'status',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'system/post',
      permission: 'system:post:remove',
    },
    export: {
      method: 'system/post/export',
      permission: 'system:post:export',
    },
    list: {
      method: 'system/post/list',
    },
  },
  columns: [
    {
      colKey: 'postId',
      title: '岗位编号',
    },
    {
      colKey: 'postCode',
      title: '岗位编码',
    },
    {
      colKey: 'postName',
      title: '岗位名称',
    },
    {
      colKey: 'postSort',
      title: '岗位排序',
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
      colKey: 'createTime',
      title: '创建时间',
    },
    {
      colKey: 'createBy',
      title: '创建人',
    },
    {
      colKey: 'updateTime',
      title: '更新时间',
    },
    {
      colKey: 'updateBy',
      title: '更新人',
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
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    items: [
                      formItemMap.postCode,
                      formItemMap.postName,
                      formItemMap.postSort,
                      {
                        ...formItemMap.status,
                        component: 'TRadioGroup',
                      },
                      formItemMap.remark,
                    ],
                    labelAlign: 'right',
                    layout: 'vertical',
                    ref: formRef,
                  }),
                header: '修改岗位',
                onConfirmCallback: async () => {
                  await alovaInst.Put('system/post', {
                    ...(await formRef.value!.validate()),
                    postId: row.postId,
                  })
                  $msg.success('岗位修改成功')
                  pageListRef.value!.query()
                },
                width: 430,
              })
            },
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [formItemMap.postCode, formItemMap.postName, formItemMap.status],
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                status: '0',
              }),
              items: [
                formItemMap.postCode,
                formItemMap.postName,
                formItemMap.postSort,
                {
                  ...formItemMap.status,
                  component: 'TRadioGroup',
                },
                formItemMap.remark,
              ],
              labelAlign: 'right',
              layout: 'vertical',
              ref: formRef,
            }),
          header: '添加岗位',
          onConfirmCallback: async () => {
            await alovaInst.Post('system/post', await formRef.value!.validate())
            $msg.success('岗位添加成功')
            pageListRef.value!.query()
          },
          width: 430,
        })
      },
      permission: 'system:post:add',
    },
  ],
  tableOtherProps: {
    rowKey: 'postId',
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
