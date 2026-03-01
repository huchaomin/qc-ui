<script setup lang="ts">
import { flatArrToTree } from '@/utils'

const pageListRef = useTemplateRef('pageListRef')
const expandedTreeNodes = ref<Array<number | string>>([])
const formItemMap = {
  component: {
    __others: (formData) => {
      return {
        show: formData.menuType === 'C',
      }
    },
    _class: 'col-span-full',
    _label: '组件路径',
    model: 'component',
    placeholder: '访问的组件路径，如：`system/user/index`，必须以index结尾，默认在`views`目录下',
  },
  icon: {
    __others: (formData) => {
      return {
        adornment: {
          append: () =>
            h(
              resolveComponent('TButton'),
              {
                default: '去选择',
                onClick: () => {
                  window.open('https://icon-sets.iconify.design/', '_blank')
                },
                variant: 'text',
              },
              {
                icon: () => h(resolveComponent('Icon'), { icon: 'line-md:link' }),
              },
            ),
          prepend: () => h(resolveComponent('Icon'), { class: 'mx-1', icon: formData.icon }),
        },
        show: formData.menuType !== 'F' && isFalsy(formData.parentId),
      }
    },
    _label: '菜单图标',
    _required: true,
    model: 'icon',
  },
  isCache: {
    __others: (formData) => {
      return {
        show: formData.menuType === 'C',
      }
    },
    _label: '是否被keep-alive缓存',
    component: 'TRadioGroup',
    model: 'isCache',
    options: [
      {
        label: '缓存',
        value: '0',
      },
      {
        label: '不缓存',
        value: '1',
      },
    ],
  },
  menuName: {
    _class: 'col-start-1',
    _label: '菜单名称',
    _required: true,
    model: 'menuName',
  },
  menuType: {
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
  orderNum: {
    _label: '显示排序',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'orderNum',
    theme: 'row',
  },
  parentId: {
    _class: 'col-span-full',
    _label: '上级菜单',
    component: 'TTreeSelect',
    data: 'systemMenuTree',
    model: 'parentId',
    placeholder: '请选择上级菜单, 不选择的话, 默认为顶级菜单',
  },
  path: {
    __others: (formData) => {
      return {
        show: formData.menuType !== 'F',
      }
    },
    _class: 'col-span-full',
    _label: '路由地址',
    _required: true,
    model: 'path',
    placeholder: '请输入路由地址, router.name就是该字段首字母大写后的结果',
  },
  perms: {
    __others: (formData) => {
      return {
        show: formData.menuType !== 'M',
      }
    },
    _label: '权限标识',
    model: 'perms',
    placeholder: '如：system:user:list',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'sys_normal_disable',
    model: 'status',
  },
  visible: {
    __others: (formData) => {
      return {
        show: formData.menuType !== 'F',
      }
    },
    _label: '是否显示',
    component: 'TRadioGroup',
    dicCode: 'sys_show_hide',
    model: 'visible',
  },
} satisfies Record<string, FormItem>
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
      cell: {
        _component: 'Icon',
      },
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
                  formRef.value!.setFormData({
                    ...row,
                    parentId: row.parentId === '0' ? '' : row.parentId,
                  })
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
                      formItemMap.menuType,
                      formItemMap.icon,
                      formItemMap.menuName,
                      formItemMap.orderNum,
                      formItemMap.path,
                      formItemMap.component,
                      formItemMap.perms,
                      formItemMap.isCache,
                      formItemMap.visible,
                      formItemMap.status,
                    ],
                    ref: formRef,
                  }),
                header: '编辑菜单',
                onConfirmCallback: async () => {
                  const formData = await formRef.value!.validate()

                  await alovaInst.Put('system/menu', {
                    ...formData,
                    menuId: row.menuId,
                    parentId: isFalsy(formData.parentId) ? '0' : formData.parentId,
                  })
                  $msg.success('菜单修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'system:menu:edit',
          }),
          ({ row }) => ({
            default: '新增',
            onClick: () => {
              const formRef = ref<FormInstance | null>(null)

              $confirm({
                body: () =>
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    data: reactive({
                      isCache: '0',
                      menuType: 'M',
                      parentId: row.menuId,
                      status: '0',
                      visible: '0',
                    }),
                    items: [
                      {
                        ...formItemMap.parentId,
                        disabled: true,
                      },
                      formItemMap.menuType,
                      formItemMap.icon,
                      formItemMap.menuName,
                      formItemMap.orderNum,
                      formItemMap.path,
                      formItemMap.component,
                      formItemMap.perms,
                      formItemMap.isCache,
                      formItemMap.visible,
                      formItemMap.status,
                    ],
                    ref: formRef,
                  }),
                header: '新增菜单',
                onConfirmCallback: async () => {
                  await alovaInst.Post('system/menu', await formRef.value!.validate())
                  $msg.success('菜单修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'system:menu:add',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.menuName,
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
                isCache: '0',
                menuType: 'M',
                status: '0',
                visible: '0',
              }),
              items: [
                formItemMap.parentId,
                formItemMap.menuType,
                formItemMap.icon,
                formItemMap.menuName,
                formItemMap.orderNum,
                formItemMap.path,
                formItemMap.component,
                formItemMap.perms,
                formItemMap.isCache,
                formItemMap.visible,
                formItemMap.status,
              ],
              ref: formRef,
            }),
          header: '添加菜单',
          onConfirmCallback: async () => {
            const formData = await formRef.value!.validate()

            await alovaInst.Post('system/menu', {
              ...formData,
              parentId: isFalsy(formData.parentId) ? '0' : formData.parentId,
            })
            $msg.success('菜单添加成功')
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
