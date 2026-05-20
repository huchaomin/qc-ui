<script setup lang="ts">
import BrandProducts from './modules/BrandProducts.vue'

const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  brandName: {
    _label: '品牌名称',
    _required: true,
    model: 'brandName',
  },
  brandProducts: {
    _class: 'col-span-full',
    _label: '品牌产品匹配规则',
    _rules: [
      {
        message: '请填写完整的品牌产品匹配规则',
        required: true,
      },
    ],
    model: 'brandProducts',
    slot: 'brandProducts',
  },
  contacts: {
    _label: '联系人',
    model: 'contacts',
  },
  contactsEmail: {
    _class: 'col-span-full',
    _label: '联系邮箱',
    component: 'TTextarea',
    maxlength: '',
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
  dataLimitNum: {
    _label: '品牌数据量上限(条)',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    min: 1,
    model: 'dataLimitNum',
  },
  dataMonth: {
    _label: '数据限制月数',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    min: 1,
    model: 'dataMonth',
  },
  dataSaveTime: {
    _label: '数据存储时间(月)',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    min: 1,
    model: 'dataSaveTime',
  },
  eventNum: {
    _label: '品牌事件数',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    min: 1,
    model: 'eventNum',
  },
  eventTaskFlag: {
    _label: '事件关联任务',
    component: 'TRadioGroup',
    dicCode: 'sys_yes_no',
    model: 'eventTaskFlag',
  },
  extraType: {
    _label: '抽帧类型',
    component: 'TSelect',
    dicCode: 'extra_cfg',
    model: 'extraType',
  },
  phraseLimitNum: {
    _label: '事件词组数',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    max: 100,
    min: 1,
    model: 'phraseLimitNum',
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
      callback: () => {
        useListRefresh('brand')
      },
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
      cell: {
        _component: 'FormatNumber',
      },
      colKey: 'eventNum',
      title: '品牌事件数',
    },
    {
      cell: {
        _component: 'FormatNumber',
      },
      colKey: 'phraseLimitNum',
      title: '事件词组数',
    },
    {
      colKey: 'dataMonth',
      title: '数据限制月数',
    },
    {
      colKey: 'dataSaveTime',
      title: '数据存储时间(月)',
    },
    {
      cell: {
        _component: 'FormatNumber',
      },
      colKey: 'dataLimitNum',
      title: '品牌数据量上限(条)',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'extra_cfg',
      },
      colKey: 'extraType',
      title: '抽帧类型',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'sys_yes_no',
      },
      colKey: 'eventTaskFlag',
      title: '事件关联任务',
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
                      h(TTypographyText, {
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
            default: '品牌配置',
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
                      formItemMap.eventNum,
                      formItemMap.phraseLimitNum,
                      formItemMap.dataMonth,
                      formItemMap.dataSaveTime,
                      formItemMap.dataLimitNum,
                      formItemMap.eventTaskFlag,
                      formItemMap.extraType,
                    ],
                    ref: formRef,
                  }),
                header: '品牌配置',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/brand', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  useListRefresh('brand')
                  $msg.success('品牌配置成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:brand:cfg',
          }),
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
                  h(
                    TForm,
                    {
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
                        formItemMap.brandProducts,
                      ],
                      ref: formRef,
                    },
                    {
                      brandProducts: () =>
                        h(BrandProducts, {
                          initData: row.brandProducts,
                        }),
                    },
                  ),
                header: '修改品牌',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/brand', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  useListRefresh('brand')
                  $msg.success('品牌修改成功')
                  pageListRef.value!.query()
                },
                width: 1250,
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
            h(
              TForm,
              {
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
                  formItemMap.eventNum,
                  formItemMap.phraseLimitNum,
                  formItemMap.dataMonth,
                  formItemMap.dataSaveTime,
                  formItemMap.dataLimitNum,
                  formItemMap.remark,
                  formItemMap.brandProducts,
                ],
                ref: formRef,
              },
              {
                brandProducts: () => h(BrandProducts),
              },
            ),
          header: '新增品牌',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/brand', await formRef.value!.validate())
            useListRefresh('brand')
            $msg.success('品牌新增成功')
            pageListRef.value!.query()
          },
          width: 1250,
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
            h(TForm, {
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
