<script setup lang="ts">
import { flatArrToTree } from '@/utils'

const pageListRef = useTemplateRef('pageListRef')
const expandedTreeNodes = ref<Array<number | string>>([])
const formItems = createFormItems([
  {
    _label: '上级菜单',
    _required: true,
    component: 'TTreeSelect',
    data: 'systemMenuTree',
    model: 'parentId',
  },
  {
    _class: 'col-span-full',
    _label: '菜单类型',
    component: 'TRadioGroup',
    model: 'menuType',
    options: [
      {
        label: '目录',
        value: 'M',
      },
      {
        label: '菜单',
        value: 'C',
      },
      {
        label: '按钮',
        value: 'F',
      },
    ],
  },
  {
    _label: '菜单名称',
    _required: true,
    model: 'menuName',
  },
  {
    _label: '显示排序',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'orderNum',
    theme: 'row',
  },
  // {
  //   _label: '字典类型',
  //   model: 'dictType',
  // },
  {
    _label: '状态',
    component: 'TSelect',
    dicCode: 'sys_normal_disable',
    model: 'status',
  },
  // {
  //   _class: 'col-span-2',
  //   _label: '创建时间',
  //   component: 'TDateRangePicker',
  //   model: 'dateRange',
  // },
  // {
  //   _label: '备注',
  //   component: 'TTextarea',
  //   model: 'remark',
  // },
] as const)
const config: PageListProps = {
  apis: {
    delete: {
      method: 'system/menu',
      permission: 'system:menu:remove',
    },
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('system/menu/list', {
          params: {
            ...o,
            pageNum: undefined,
            pageSize: undefined,
          },
          transform: (res: Record<string, any>[]) => {
            return {
              rows: flatArrToTree(res, {
                idKey: 'menuId',
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
      colKey: 'menuName',
      fixed: 'left',
      title: '菜单名称',
      width: 280,
    },
    {
      colKey: 'orderNum',
      title: '排序',
    },
    {
      colKey: 'icon',
      title: '图标',
    },

    {
      colKey: 'perms',
      title: '权限标识',
    },
    {
      colKey: 'component',
      title: '组件路径',
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
    // {
    //   cell: {
    //     _component: 'Buttons',
    //     buttons: [
    //       ({ row }) => ({
    //         default: '编辑',
    //         onClick: () => {
    //           const formRef = ref<FormInstance | null>(null)

    //           $confirm({
    //             body: () =>
    //               h(resolveComponent('TForm') as Component<FormProps>, {
    //                 data: reactive({
    //                   dictId: row.dictId,
    //                   dictName: row.dictName,
    //                   dictType: row.dictType,
    //                   remark: row.remark,
    //                   status: row.status,
    //                 }),
    //                 items: pickFormItems(formItems, ['dictName', 'dictType', 'status', 'remark'], {
    //                   dictName: {
    //                     _required: true,
    //                   },
    //                   dictType: {
    //                     _required: true,
    //                   },
    //                   status: {
    //                     // @ts-expect-error TRadioGroup 和 TSelect 的 props 在此处是兼容的
    //                     component: 'TRadioGroup',
    //                   },
    //                 }),
    //                 labelAlign: 'right',
    //                 layout: 'vertical',
    //                 ref: formRef,
    //               }),
    //             header: '修改字典类型',
    //             onConfirmCallback: async () => {
    //               await alovaInst.Put('system/dict/type', await formRef.value!.validate())
    //               $msg.success('字典修改成功')
    //               pageListRef.value!.query()
    //             },
    //             width: 430,
    //           })
    //         },
    //       }),
    //     ],
    //   },
    //   colKey: '_operation',
    //   title: '操作',
    // },
  ],
  formItems: pickFormItems(formItems, ['menuName', 'status'], {
    menuName: {
      _required: false,
    },
  }),
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                menuType: 'M',
              }),
              items: pickFormItems(formItems, ['parentId', 'menuType', 'menuName', 'orderNum'], {}),
              ref: formRef,
            }),
          header: '添加字典类型',
          onConfirmCallback: async () => {
            await alovaInst.Post('system/dict/type', await formRef.value!.validate())
            $msg.success('字典添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'system:menu:add',
    },
  ],
  tableOtherProps: reactive({
    expandedTreeNodes,
    onExpandedTreeNodesChange: (keys: Array<number | string>) => {
      expandedTreeNodes.value = keys
    },
    rowKey: 'menuId',
    showSerialNumber: false,
  }),
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
