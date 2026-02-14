<script setup lang="ts">
// import DictTypeDetail from './modules/DictTypeDetail.vue'

const pageListRef = useTemplateRef('pageListRef')
const formItems = createFormItems([
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
  {
    _label: '备注',
    component: 'TTextarea',
    model: 'remark',
  },
] as const)
const config: PageListProps = {
  apis: {
    delete: {
      method: 'system/user',
      permission: 'system:user:remove',
    },
    export: {
      method: 'system/user/export',
      permission: 'system:user:export',
    },
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('system/user/list', {
          params: {
            ...o,
            dateRange: undefined,
            'params[beginTime]': o.dateRange[0] ?? '',
            'params[endTime]': o.dateRange[1] ?? '',
          },
          // transform: (res:any) => {
          //   return {
          //     rows: res.rows.map(r => {
          //       ...r,
          //     }),
          //     total: res.total,
          //   }
          // }
        })
      },
    },
  },
  columns: [
    {
      colKey: 'userId',
      title: '用户编号',
    },
    {
      cell: {
        _component: 'TypographyText',
        copyable: true,
      },
      colKey: 'userName',
      title: '登录账号',
    },
    {
      cell: {
        _component: 'OptionLabel',
        multiple: true,
        useListKey: 'brand',
        valueKey: 'deptId',
      },
      colKey: 'userDeptIds',
      title: '品牌',
    },
    {
      colKey: 'nickName',
      title: '用户昵称',
    },
    {
      colKey: 'dept.deptName',
      title: '部门',
    },
    {
      colKey: 'phonenumber',
      title: '手机号码',
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
          ({ row }) => ({
            default: '编辑',
            onClick: () => {
              const formRef = ref<FormInstance | null>(null)

              $confirm({
                body: () =>
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    data: reactive({
                      dictId: row.dictId,
                      dictName: row.dictName,
                      dictType: row.dictType,
                      remark: row.remark,
                      status: row.status,
                    }),
                    items: pickFormItems(formItems, ['dictName', 'dictType', 'status', 'remark'], {
                      dictName: {
                        _required: true,
                      },
                      dictType: {
                        _required: true,
                      },
                      status: {
                        // @ts-expect-error TRadioGroup 和 TSelect 的 props 在此处是兼容的
                        component: 'TRadioGroup',
                      },
                    }),
                    labelAlign: 'right',
                    layout: 'vertical',
                    ref: formRef,
                  }),
                header: '修改字典类型',
                onConfirmCallback: async () => {
                  await alovaInst.Put('system/dict/type', await formRef.value!.validate())
                  $msg.success('字典修改成功')
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
  formItems: pickFormItems(formItems, ['dictName', 'dictType', 'status', 'dateRange']),
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
              items: pickFormItems(formItems, ['dictName', 'dictType', 'status', 'remark'], {
                dictName: {
                  _required: true,
                },
                dictType: {
                  _required: true,
                },
                status: {
                  // @ts-expect-error TRadioGroup 和 TSelect 的 props 在此处是兼容的
                  component: 'TRadioGroup',
                },
              }),
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
      permission: 'system:user:add',
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
      permission: 'system:user:remove',
    },
  ],
  tableOtherProps: {
    rowKey: 'userId',
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
