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
    export: {
      method: 'yq/frameExtraRecord/export',
      permission: 'yq:frameExtraRecord:export',
    },
    list: {
      method: 'yq/frameExtraRecord/list',
    },
  },
  columns: [
    {
      cell: {
        _component: 'OptionLabel',
        options: 'brand',
      },
      colKey: 'brandId',
      title: '品牌',
    },
    {
      colKey: 'eventId',
      title: '事件编号',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'extra_type',
      },
      colKey: 'extraType',
      title: '抽帧类型',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'extra_num_type',
      },
      colKey: 'extraNumType',
      title: '抽帧数量配置',
    },
    {
      colKey: 'extraNum',
      title: '固定帧数',
    },
    {
      colKey: 'successNum',
      title: '成功数量',
    },
    {
      colKey: 'failNum',
      title: '失败数量',
    },
    {
      colKey: 'totalExtraNum',
      title: '总抽取帧数',
    },
    {
      align: 'right',
      cell: {
        _component: 'FormatNumber',
      },
      colKey: 'prePoints',
      title: '预扣积分',
    },
    {
      align: 'right',
      cell: {
        _component: 'FormatNumber',
      },
      colKey: 'actualPoints',
      title: '实扣积分',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'extra_record_status',
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
                  await alovaInst.Put('yq/frameExtraRecord', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('机构修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:frameExtraRecord:edit',
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
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
