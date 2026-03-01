<script setup lang="ts">
import { flatArrToTree } from '@/utils'

const pageListRef = useTemplateRef('pageListRef')
const expandedTreeNodes = ref<Array<number | string>>([])
const formItemMap = {
  deptName: {
    _label: '部门名称',
    _required: true,
    model: 'deptName',
  },
  email: {
    _label: '邮箱',
    _rules: [
      {
        email: true,
        message: '请填写正确的邮箱', // TODO
      },
    ],
    model: 'email',
  },
  leader: {
    _label: '负责人',
    maxlength: 20,
    model: 'leader',
  },
  orderNum: {
    _label: '显示排序',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'orderNum',
    theme: 'row',
  },
  parentId: {
    __others: (formData) => {
      return {
        _label: '上级部门',
        _required: true,
        component: 'TTreeSelect',
        data: 'systemDeptTree',
        show: formData.parentId !== '0',
        treeProps: {
          expandAll: true,
        },
      }
    },
    model: 'parentId',
  },
  phone: {
    _label: '联系电话',
    _rules: [
      {
        telnumber: true,
      },
    ],
    model: 'phone',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'sys_normal_disable',
    model: 'status',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('system/dept/list', {
          params: {
            ...o,
            pageNum: undefined,
            pageSize: undefined,
          },
          transform: (res: Record<string, any>[]) => {
            return {
              rows: flatArrToTree(res, {
                idKey: 'deptId',
              }),
              total: 0,
            }
          },
        })
      },
    },
  },
  columns: [
    {
      colKey: 'deptName',
      fixed: 'left',
      title: '部门名称',
      width: 280,
    },
    {
      colKey: 'orderNum',
      title: '排序',
    },
    {
      colKey: 'deptId',
      title: '部门ID',
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
                      formItemMap.parentId,
                      formItemMap.deptName,
                      formItemMap.orderNum,
                      formItemMap.leader,
                      formItemMap.phone,
                      formItemMap.email,
                      formItemMap.status,
                    ],
                    ref: formRef,
                  }),
                header: '编辑部门',
                onConfirmCallback: async () => {
                  const formData = await formRef.value!.validate()

                  await alovaInst.Put('system/dept', {
                    ...formData,
                    deptId: row.deptId,
                  })
                  $msg.success('部门修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'system:dept:edit',
          }),
          ({ row }) => ({
            default: '新增',
            onClick: () => {
              const formRef = ref<FormInstance | null>(null)

              $confirm({
                body: () =>
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    data: reactive({
                      parentId: row.deptId,
                      status: '0',
                    }),
                    items: [
                      {
                        ...formItemMap.parentId,
                        disabled: true,
                      },
                      formItemMap.deptName,
                      formItemMap.orderNum,
                      formItemMap.leader,
                      formItemMap.phone,
                      formItemMap.email,
                      formItemMap.status,
                    ],
                    ref: formRef,
                  }),
                header: '新增部门',
                onConfirmCallback: async () => {
                  await alovaInst.Post('system/dept', await formRef.value!.validate())
                  $msg.success('部门添加成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'system:dept:add',
          }),
          ({ row }) => ({
            default: '删除',
            permission: 'system:dept:remove',
            popconfirm: {
              content: '确认删除吗',
              onConfirm: async () => {
                await alovaInst.Delete(`system/dept/${row.deptId}`)
                $msg('删除成功')
                pageListRef.value!.query()
              },
            },
            show: row.parentId !== '0',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.deptName,
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
                status: '0',
              }),
              items: [
                formItemMap.parentId,
                formItemMap.deptName,
                formItemMap.orderNum,
                formItemMap.leader,
                formItemMap.phone,
                formItemMap.email,
                formItemMap.status,
              ],
              ref: formRef,
            }),
          header: '添加部门',
          onConfirmCallback: async () => {
            await alovaInst.Post('system/dept', await formRef.value!.validate())
            $msg.success('部门添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'system:dept:add',
    },
  ],
  tableOtherProps: reactive({
    expandedTreeNodes,
    onExpandedTreeNodesChange: (keys: Array<number | string>) => {
      expandedTreeNodes.value = keys
    },
    rowKey: 'deptId',
    showSerialNumber: false,
  }),
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
