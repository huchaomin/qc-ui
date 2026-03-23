<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  adminAcc: {
    _label: '管理员账号',
    model: 'adminAcc',
  },
  adminName: {
    _label: '法人',
    model: 'adminName',
  },
  contactPhone: {
    _label: '联系电话',
    _rules: [
      {
        telnumber: true,
      },
    ],
    model: 'contactPhone',
  },
  idNo: {
    _label: '法人身份证',
    model: 'idNo',
  },
  orgName: {
    _label: '机构名称',
    model: 'orgName',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/orgManage',
      permission: 'yq:orgManage:remove',
    },
    export: {
      method: 'yq/orgManage/export',
      permission: 'yq:orgManage:export',
    },
    list: {
      method: 'yq/orgManage/list',
    },
  },
  columns: [
    {
      colKey: 'id',
      title: '机构ID',
    },
    {
      colKey: 'orgName',
      title: '机构名称',
    },
    {
      colKey: 'adminAcc',
      title: '管理员账号',
    },
    {
      colKey: 'adminName',
      title: '法人',
    },
    {
      colKey: 'idNo',
      title: '法人身份证',
    },
    {
      colKey: 'contactPhone',
      title: '联系电话',
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
      title: '创建日期',
    },
    {
      colKey: 'updateBy',
      title: '更新人',
    },
    {
      colKey: 'updateTime',
      title: '更新日期',
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
                      formItemMap.orgName,
                      formItemMap.adminAcc,
                      formItemMap.adminName,
                      formItemMap.idNo,
                      formItemMap.contactPhone,
                      formItemMap.status,
                    ],
                    ref: formRef,
                  }),
                header: '修改机构',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/orgManage', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('机构修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:orgManage:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.orgName,
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
                formItemMap.orgName,
                formItemMap.adminAcc,
                formItemMap.adminName,
                formItemMap.idNo,
                formItemMap.contactPhone,
                formItemMap.status,
              ],
              ref: formRef,
            }),
          header: '添加机构',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/orgManage', await formRef.value!.validate())
            $msg.success('机构添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:orgManage:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
