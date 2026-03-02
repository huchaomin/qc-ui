<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  brandName: {
    _label: '品牌名称',
    _required: true,
    model: 'brandName',
  },
  contacts: {
    _label: '联系人',
    model: 'contacts',
  },
  contactsEmail: {
    _class: 'col-span-full',
    _label: '联系邮箱',
    component: 'TTextarea',
    maxlength: Infinity,
    model: 'contactsEmail',
  },
  contactsPhone: {
    _label: '联系电话',
    _rules: [
      {
        telnumber: true,
      },
    ],
    model: 'contactsPhone',
  },
  remark: {
    _class: 'col-span-full',
    _label: '品牌备注',
    model: 'remark',
  },
  screenData: {
    _label: '是否大屏数据',
    component: 'TRadioGroup',
    dicCode: 'sys_yes_no',
    model: 'screenData',
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
      method: 'yq/brand',
      permission: 'yq:brand:remove',
    },
    export: {
      method: 'yq/brand/export',
      permission: 'yq:brand:export',
    },
    list: {
      method: 'yq/brand/list',
    },
  },
  columns: [
    {
      colKey: 'brandName',
      title: '品牌名称',
    },
    {
      colKey: 'remark',
      title: '品牌备注',
    },
    {
      colKey: 'contacts',
      title: '联系人',
    },
    {
      colKey: 'contactsPhone',
      title: '联系电话',
    },
    {
      cell: (_, { row }) => {
        if (isFalsy(row.contactsEmail)) {
          return undefined
        }

        return {
          _component: 'Link',
          default: '查看邮箱',
          onClick: () => {
            $dialog({
              body: () =>
                h(
                  'div',
                  {
                    class: 'flex flex-wrap row-gap-2',
                  },
                  (row.contactsEmail ?? '')
                    .split(',')
                    .filter(Boolean)
                    .map((email: string) =>
                      h(resolveComponent('TTypographyText'), {
                        class: 'my-0!',
                        content: email,
                        copyable: true,
                      }),
                    ),
                ),
              footer: false,
              header: '查看邮箱',
              width: 300,
            })
          },
        }
      },
      colKey: 'contactsEmail',
      title: '联系邮箱',
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
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    items: [
                      formItemMap.brandName,
                      formItemMap.contacts,
                      formItemMap.contactsPhone,
                      {
                        ...formItemMap.status,
                        component: 'TRadioGroup',
                      },
                      formItemMap.screenData,
                      formItemMap.contactsEmail,
                      formItemMap.remark,
                    ],
                    ref: formRef,
                  }),
                header: '修改品牌',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/brand', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('品牌修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:brand:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.brandName,
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
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                screenData: 'N',
                status: '0',
              }),
              items: [
                formItemMap.brandName,
                formItemMap.contacts,
                formItemMap.contactsPhone,
                {
                  ...formItemMap.status,
                  component: 'TRadioGroup',
                },
                formItemMap.screenData,
                formItemMap.contactsEmail,
                formItemMap.remark,
              ],
              ref: formRef,
            }),
          header: '新增品牌',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/brand', await formRef.value!.validate())
            $msg.success('品牌新增成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:brand:add',
    },
    {
      default: '发送邮件',
      onClick: async () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                brandIds: [],
                days: 1,
                reportType: '1',
              }),
              items: [
                {
                  _label: '距今天数',
                  _required: true,
                  component: 'TInputNumber',
                  decimalPlaces: 0,
                  max: 365,
                  min: 1,
                  model: 'days',
                },
                {
                  __others: (formData) => {
                    return {
                      onChange: () => {
                        formData.taskIds = []
                      },
                    }
                  },
                  _label: '品牌',
                  _required: true,
                  component: 'TSelect',
                  model: 'brandIds',
                  multiple: true,
                  options: 'brand',
                },
                {
                  __others: (formData) => {
                    return {
                      disabled: formData.brandIds.length === 0,
                      options: useList('task').value.filter((item) =>
                        formData.brandIds.includes(item.brandId),
                      ),
                    }
                  },
                  _label: '任务',
                  component: 'TSelect',
                  model: 'taskIds',
                  multiple: true,
                },
                {
                  _label: '日报类型',
                  component: 'TRadioGroup',
                  model: 'reportType',
                  options: [
                    {
                      label: '老日报',
                      value: '0',
                    },
                    {
                      label: '新日报',
                      value: '1',
                    },
                  ],
                },
              ],
              ref: formRef,
            }),
          header: '确认发送邮件',
          onConfirmCallback: async () => {
            await alovaInst.Post(
              'yq/brand/sendEmails',
              {
                ...(await formRef.value!.validate()),
                ids: pageListRef.value!.selectedRows.map((item) => item.id),
              },
              {
                meta: {
                  useLoading: '邮件发送中...',
                },
                timeout: 0,
              },
            )
            $msg('邮件发送成功')
          },
          width: 430, // 730
        })
      },
      permission: 'task:monitorTask:sendEmails',
    },
  ],
  tableOtherProps: {
    showRowSelect: 'multiple',
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
