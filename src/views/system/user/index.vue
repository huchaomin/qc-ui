<script setup lang="ts">
import TTable from '@/components/tDesignReset/TTable.vue'
import { passwordReg, passwordRegMessage } from '@/utils/config'

const { send } = useRequest(
  (id) =>
    alovaInst.Get<any>(`system/user/${id}`, {
      meta: {
        useDataResult: false,
      },
    }),
  {
    immediate: false,
  },
)
const pageListRef = useTemplateRef('pageListRef')
const formItems = createFormItems([
  {
    _label: '用户昵称',
    _required: true,
    maxlength: 30,
    model: 'nickName',
  },
  {
    _label: '品牌',
    _required: true,
    component: 'TSelect',
    keys: {
      value: 'deptId',
    },
    model: 'userDeptIds',
    multiple: true,
    options: 'brand',
  },
  {
    _label: '归属部门',
    component: 'TTreeSelect',
    data: 'systemDeptTree',
    model: 'deptId',
    treeProps: {
      expandAll: true,
    },
  },
  {
    _label: '手机号码',
    _rules: [
      {
        telnumber: true,
      },
    ],
    model: 'phonenumber',
  },
  {
    _label: '邮箱',
    _rules: [
      {
        email: true,
        message: '请填写正确的邮箱', // TODO
      },
    ],
    model: 'email',
  },
  {
    _label: '登录账号',
    _required: true,
    _rules: [
      {
        message: '登录账号长度为2-20个字符',
        min: 2,
      },
      {
        max: 20,
        message: '登录账号长度为2-20个字符',
      },
    ],
    model: 'userName',
  },
  {
    _label: '登录密码',
    _required: true,
    _rules: [
      {
        message: passwordRegMessage,
        pattern: passwordReg,
      },
    ],
    autocomplete: 'new-password',
    model: 'password',
    type: 'password',
  },
  {
    _label: '用户性别',
    component: 'TSelect',
    dicCode: 'sys_user_sex',
    model: 'sex',
  },
  {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'sys_normal_disable',
    model: 'status',
  },
  {
    _label: '岗位',
    component: 'TSelect',
    model: 'postIds',
    multiple: true,
    options: [],
  },
  {
    _label: '角色',
    component: 'TSelect',
    model: 'roleIds',
    multiple: true,
    options: [],
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
        options: 'brand',
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
      cell: (_, { row }) => {
        return {
          _component: 'Switch',
          customValue: ['0', '1'],
          modelValue: row.status as string,
          onChange: async (value) => {
            const text = row.status === '1' ? '启用' : '停用'

            await $confirm(`确认${text}${row.userName}用户吗？`)
            await alovaInst.Put(
              'system/user/changeStatus',
              {
                status: value,
                userId: row.userId,
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
              const { data, postIds, posts, roleIds, roles } = await send(row.userId)
              const formRef = ref<FormInstance | null>(null)

              $confirm({
                body: () =>
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    data: reactive({
                      deptId: data.deptId,
                      email: data.email,
                      nickName: data.nickName,
                      phonenumber: data.phonenumber,
                      postIds,
                      remark: data.remark,
                      roleIds,
                      sex: data.sex,
                      status: data.status,
                      userDeptIds: (data.userDeptIds ?? '').split(',').filter(Boolean),
                    }),
                    items: pickFormItems(
                      formItems,
                      [
                        'nickName',
                        'userDeptIds',
                        'deptId',
                        'phonenumber',
                        'email',
                        'sex',
                        'status',
                        'postIds',
                        'roleIds',
                        'remark',
                      ],
                      {
                        postIds: {
                          options: posts.map((item: any) => ({
                            disabled: item.status === '1',
                            label: item.postName,
                            value: item.postId,
                          })),
                        },
                        roleIds: {
                          options: roles.map((item: any) => ({
                            disabled: item.status === '1',
                            label: item.roleName,
                            value: item.roleId,
                          })),
                        },
                      },
                    ),
                    ref: formRef,
                  }),
                header: '修改用户',
                onConfirmCallback: async () => {
                  const formData = await formRef.value!.validate()

                  await alovaInst.Put('system/user', {
                    ...formData,
                    userDeptIds: formData.userDeptIds.join(','),
                    userId: data.userId,
                    userName: data.userName,
                  })
                  $msg.success('用户修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'system:user:edit',
            show: row.userId !== '1',
          }),
          ({ row }) => ({
            default: '重置密码',
            onClick: async () => {
              const formRef = ref<FormInstance | null>(null)

              $confirm({
                body: () =>
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    items: [
                      {
                        _required: true,
                        _rules: [
                          {
                            message: passwordRegMessage,
                            pattern: passwordReg,
                          },
                        ],
                        model: 'newPassword',
                        type: 'password',
                      },
                    ],
                    ref: formRef,
                  }),
                header: `请输入${row.userName}用户的新密码`,
                onConfirmCallback: async () => {
                  const newPassword = (await formRef.value!.validate()).newPassword

                  await alovaInst.Put('system/user/resetPwd', {
                    password: newPassword,
                    userId: row.userId,
                  })
                  $notify(`密码修改成功，新密码是：${newPassword}`)
                  pageListRef.value!.query()
                },
                width: 430,
              })
            },
            permission: 'system:user:resetPwd',
            show: row.userId !== '1',
          }),
          ({ row }) => ({
            default: '分配角色',
            onClick: async () => {
              const { roles, user } = await alovaInst.Get<any>(`system/user/authRole/${row.userId}`)
              const tableRef = ref<InstanceType<typeof TTable> | null>(null)

              $confirm({
                body: () =>
                  h(TTable, {
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
                        colKey: 'createTime',
                        title: '创建时间',
                      },
                      {
                        colKey: 'remark',
                        title: '角色说明',
                      },
                    ],
                    data: roles,
                    ref: tableRef,
                    rowKey: 'roleId',
                    selectedRowKeys: roles
                      .filter((item: any) => item.flag)
                      .map((item: any) => item.roleId),
                    showRowSelect: 'multiple',
                  }),
                header: `为用户${user.nickName}(${user.userName})分配角色`,
                onConfirmCallback: async () => {
                  await alovaInst.Put(
                    'system/user/authRole',
                    {},
                    {
                      meta: {
                        useSuccessMsg: true,
                      },
                      params: {
                        roleIds: tableRef.value!.selectedRowKeys.join(','),
                        userId: row.userId,
                      },
                    },
                  )
                  pageListRef.value!.query()
                },
                width: 800,
              })
            },
            permission: 'system:user:edit',
            show: row.userId !== '1',
          }),
          ({ row }) => ({
            default: '删除',
            permission: 'system:user:remove',
            popconfirm: {
              content: '确认删除吗',
              onConfirm: async () => {
                await alovaInst.Delete(`system/user/${row.userId}`)
                $msg('删除成功')
                pageListRef.value!.query()
              },
            },
            show: row.userId !== '1',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    ...pickFormItems(formItems, ['deptId', 'userName', 'phonenumber', 'status'], {
      phonenumber: {
        _required: false,
        _rules: [],
      },
      status: {
        // @ts-expect-error TRadioGroup 和 TSelect 的 props 在此处是兼容的
        component: 'TSelect',
      },
      userName: {
        _required: false,
        _rules: [],
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
        const { posts, roles } = await send('')
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                status: '0',
              }),
              items: pickFormItems(
                formItems,
                [
                  'nickName',
                  'userDeptIds',
                  'deptId',
                  'phonenumber',
                  'email',
                  'userName',
                  'password',
                  'sex',
                  'status',
                  'postIds',
                  'roleIds',
                  'remark',
                ],
                {
                  postIds: {
                    options: posts.map((item: any) => ({
                      disabled: item.status === '1',
                      label: item.postName,
                      value: item.postId,
                    })),
                  },
                  roleIds: {
                    options: roles.map((item: any) => ({
                      disabled: item.status === '1',
                      label: item.roleName,
                      value: item.roleId,
                    })),
                  },
                },
              ),
              ref: formRef,
            }),
          header: '添加用户',
          onConfirmCallback: async () => {
            const formData = await formRef.value!.validate()

            await alovaInst.Post('system/user', {
              ...formData,
              userDeptIds: formData.userDeptIds.join(','),
            })
            $msg.success('用户添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'system:user:add',
    },
    {
      default: '导入',
      onClick: async () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(resolveComponent('TForm') as Component<FormProps>, {
              items: [
                {
                  _required: true,
                  component: 'TUpload',
                  downloadTemplate: alovaInst.Post<Blob>(
                    'system/user/importTemplate',
                    {},
                    {
                      meta: {
                        useDownload: '用户管理导入模板.xlsx',
                        useResponseBlob: true,
                      },
                    },
                  ),
                  model: 'file',
                  tips: '请下载模板，并按照模板格式导入',
                },
                {
                  component: 'TCheckbox',
                  label: '是否更新已经存在的用户数据',
                  model: 'updateSupport',
                },
              ],
              ref: formRef,
            }),
          header: '导入用户',
          onConfirmCallback: async () => {
            const formData = await formRef.value!.validate()

            await alovaInst.Post(
              'system/user/importTemplate',
              {
                file: formData.file[0].raw,
              },
              {
                meta: {
                  useFormData: true,
                },
                params: {
                  updateSupport: formData.updateSupport,
                },
              },
            )
            pageListRef.value!.query()
          },
          width: 480,
        })
      },
      permission: 'system:user:import',
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
