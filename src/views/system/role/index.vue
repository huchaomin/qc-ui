<script setup lang="ts">
import AssignUser from './modules/AssignUser.vue'
import SelectDept from './modules/SelectDept.vue'
import SelectMenu from './modules/SelectMenu.vue'

const pageListRef = useTemplateRef('pageListRef')
const formItems = createFormItems([
  {
    _label: '角色名称',
    _required: true,
    maxlength: 30,
    model: 'roleName',
  },
  {
    _label: '权限字符',
    _required: true,
    model: 'roleKey',
  },
  {
    _label: '显示顺序',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'roleSort',
    theme: 'row',
  },
  {
    _label: '角色状态',
    component: 'TRadioGroup',
    dicCode: 'sys_normal_disable',
    model: 'status',
  },
  {
    _class: 'col-span-full',
    _label: '备注',
    component: 'TTextarea',
    model: 'remark',
  },
] as const)
const config: PageListProps = {
  apis: {
    export: {
      method: 'system/role/export',
      permission: 'system:role:export',
    },
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('system/role/list', {
          params: {
            ...o,
            dateRange: undefined,
            'params[beginTime]': o.dateRange[0] ?? '',
            'params[endTime]': o.dateRange[1] ?? '',
          },
        })
      },
    },
  },
  columns: [
    {
      colKey: 'roleId',
      title: '角色编号',
    },
    {
      colKey: 'roleName',
      title: '角色名称',
    },
    {
      colKey: 'roleKey',
      title: '权限字符',
    },
    {
      colKey: 'roleSort',
      title: '显示顺序',
    },
    {
      cell: (_, { row }) => {
        return {
          _component: 'Switch',
          customValue: ['0', '1'],
          disabled: row.roleId === '1',
          modelValue: row.status as string,
          onChange: async (value) => {
            const text = row.status === '1' ? '启用' : '停用'

            await $confirm(`确认${text}${row.roleName}角色吗？`)
            await alovaInst.Put(
              'system/role/changeStatus',
              {
                roleId: row.roleId,
                status: value,
              },
              {
                meta: {
                  useSuccessMsg: true,
                },
              },
            )
            pageListRef.value!.query()
          },
        }
      },
      colKey: 'status',
      title: '角色状态',
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
            onClick: async () => {
              const { checkedKeys, menus } = await alovaInst.Get<any>(
                `system/menu/roleMenuTreeselect/${row.roleId}`,
              )
              const formRef = ref<FormInstance | null>(null)

              // 父子联动时，后端去掉了parent的id, 这里加上来
              if (row.menuCheckStrictly) {
                const childrenSome = (arr: any[]): boolean => {
                  return arr.some((item) => {
                    if (item.children) {
                      return childrenSome(item.children) || checkedKeys.includes(item.id)
                    } else {
                      return checkedKeys.includes(item.id)
                    }
                  })
                }
                const addParentWhenChildrenSome = (arr: any[]) => {
                  arr.forEach((item) => {
                    if (item.children) {
                      if (childrenSome(item.children)) {
                        if (!checkedKeys.includes(item.id)) {
                          checkedKeys.push(item.id)
                        }
                      }

                      addParentWhenChildrenSome(item.children)
                    }
                  })
                }

                addParentWhenChildrenSome(menus)
              }

              watch(
                formRef,
                () => {
                  formRef.value!.setFormData(row, {
                    isNotFalsy: true,
                  })
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () => {
                  return h(
                    resolveComponent('TForm') as Component<FormProps>,
                    {
                      data: reactive({
                        menuIds: checkedKeys,
                      }),
                      items: [
                        ...pickFormItems(formItems, ['roleName', 'roleKey', 'roleSort', 'status']),
                        {
                          _class: 'col-span-full',
                          _label: '角色类型',
                          _rules: [
                            {
                              message: '请选择角色类型',
                              required: true,
                            },
                          ],
                          model: 'menuIds',
                          slot: 'menu_ids',
                        },
                        ...pickFormItems(formItems, ['remark']),
                      ],
                      ref: formRef,
                    },
                    {
                      menu_ids: () => h(SelectMenu, { menuOptions: menus }),
                    },
                  )
                },
                header: '修改角色',
                onConfirmCallback: async () => {
                  await alovaInst.Put('system/role', {
                    ...(await formRef.value!.validate()),
                    menuCheckStrictly: false,
                    roleId: row.roleId,
                  })
                  $msg.success('角色修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'system:role:edit',
            show: row.roleId !== '1',
          }),
          ({ row }) => ({
            default: '数据权限',
            onClick: async () => {
              const { checkedKeys, depts } = await alovaInst.Get<any>(
                `system/role/deptTree/${row.roleId}`,
              )
              const formRef = ref<FormInstance | null>(null)

              // 父子联动时，后端去掉了parent的id, 这里加上来
              if (row.deptCheckStrictly) {
                const childrenSome = (arr: any[]): boolean => {
                  return arr.some((item) => {
                    if (item.children) {
                      return childrenSome(item.children) || checkedKeys.includes(item.id)
                    } else {
                      return checkedKeys.includes(item.id)
                    }
                  })
                }
                const addParentWhenChildrenSome = (arr: any[]) => {
                  arr.forEach((item) => {
                    if (item.children) {
                      if (childrenSome(item.children)) {
                        if (!checkedKeys.includes(item.id)) {
                          checkedKeys.push(item.id)
                        }
                      }

                      addParentWhenChildrenSome(item.children)
                    }
                  })
                }

                addParentWhenChildrenSome(depts)
              }

              watch(
                formRef,
                () => {
                  formRef.value!.setFormData(row, {
                    isNotFalsy: true,
                  })
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () =>
                  h(
                    resolveComponent('TForm') as Component<FormProps>,
                    {
                      data: reactive({
                        deptIds: checkedKeys,
                      }),
                      items: [
                        {
                          _label: '角色名称',
                          disabled: true,
                          model: 'roleName',
                        },
                        {
                          _label: '权限字符',
                          disabled: true,
                          model: 'roleKey',
                        },
                        {
                          _label: '权限范围',
                          component: 'TSelect',
                          dicCode: 'role_data_scope',
                          model: 'dataScope',
                        },
                        (formData) => ({
                          _label: '数据权限',
                          _rules: [
                            {
                              message: '请选择数据权限',
                              required: true,
                            },
                          ],
                          model: 'deptIds',
                          show: formData.dataScope === '2',
                          slot: 'dept_ids',
                        }),
                      ],
                      ref: formRef,
                    },
                    {
                      dept_ids: () => h(SelectDept, { deptOptions: depts }),
                    },
                  ),
                header: `给${row.roleName}分配数据权限`,
                onConfirmCallback: async () => {
                  await alovaInst.Put('system/role/dataScope', {
                    deptIds: [],
                    ...(await formRef.value!.validate()),
                    deptCheckStrictly: false,
                    roleId: row.roleId,
                  })
                  $msg.success('数据权限分配成功')
                  pageListRef.value!.query()
                },
                width: 430,
              })
            },
            permission: 'system:role:edit',
            show: row.roleId !== '1',
          }),
          ({ row }) => ({
            default: '分配用户',
            onClick: async () => {
              $dialog({
                body: () =>
                  h(AssignUser, {
                    roleId: row.roleId,
                  }),
                footer: false,
                header: `给${row.roleName}分配用户`,
                width: 1500,
              })
            },
            permission: 'system:role:edit',
            show: row.roleId !== '1',
          }),
          ({ row }) => ({
            default: '删除',
            permission: 'system:role:remove',
            popconfirm: {
              content: '确认删除吗',
              onConfirm: async () => {
                await alovaInst.Delete(`system/role/${row.roleId}`)
                $msg('删除成功')
                pageListRef.value!.query()
              },
            },
            show: row.roleId !== '1',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    ...pickFormItems(formItems, ['roleName', 'roleKey', 'status'], {
      roleKey: {
        _required: false,
      },
      roleName: {
        _required: false,
      },
      status: {
        // @ts-expect-error TRadioGroup 和 TSelect 的 props 在此处是兼容的
        component: 'TSelect',
      },
    }),
    {
      _class: 'col-span-2',
      _label: '创建时间',
      component: 'TDateRangePicker',
      model: 'dateRange',
    },
  ],
  operations: [
    {
      default: '新增',
      onClick: async () => {
        const menuOptions = await alovaInst.Get<any[]>('system/menu/treeselect')
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(
              resolveComponent('TForm') as Component<FormProps>,
              {
                data: reactive({
                  menuIds: [],
                  status: '0',
                }),
                items: [
                  ...pickFormItems(formItems, ['roleName', 'roleKey', 'roleSort', 'status']),
                  {
                    _class: 'col-span-full',
                    _label: '角色类型',
                    _rules: [
                      {
                        message: '请选择角色类型',
                        required: true,
                      },
                    ],
                    model: 'menuIds',
                    slot: 'menu_ids',
                  },
                  ...pickFormItems(formItems, ['remark']),
                ],
                ref: formRef,
              },
              {
                menu_ids: () => h(SelectMenu, { menuOptions }),
              },
            ),
          header: '添加角色',
          onConfirmCallback: async () => {
            await alovaInst.Post('system/role', {
              ...(await formRef.value!.validate()),
              menuCheckStrictly: false,
            })
            $msg.success('角色添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'system:role:add',
    },
  ],
  tableOtherProps: {
    rowKey: 'roleId',
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
