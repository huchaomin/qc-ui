<script setup lang="ts">
import SelectUser from './SelectUser.vue'

const props = withDefaults(
  defineProps<{
    roleId: string
  }>(),
  {},
)
const pageListRef = useTemplateRef('pageListRef')
const selectedRowKeys = computed(() => pageListRef.value?.selectedRowKeys ?? [])
const tableCol: TableCol[] = [
  {
    colKey: 'userName',
    title: '用户名称',
  },
  {
    colKey: 'nickName',
    title: '用户昵称',
  },
  {
    colKey: 'email',
    title: '邮箱',
  },
  {
    colKey: 'phonenumber',
    title: '手机',
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
]
const config: PageListProps = {
  apis: {
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('system/role/authUser/allocatedList', {
          params: {
            ...o,
            roleId: props.roleId,
          },
        })
      },
    },
  },
  cardProps: {
    bodyClassName: 'p-0!',
    shadow: false,
  },
  columns: [
    ...tableCol,
    {
      cell: {
        _component: 'Buttons',
        buttons: [
          ({ row }) => ({
            default: '取消授权',
            onClick: async () => {
              await $confirm(`确认要取消用户${row.userName}授权的当前角色？`)
              await alovaInst.Put('system/role/authUser/cancel', {
                roleId: props.roleId,
                userId: row.userId,
              })
              $msg.success('取消授权成功')
              pageListRef.value!.query()
            },
            permission: 'system:role:remove',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    {
      _label: '用户名称',
      model: 'userName',
    },
    {
      _label: '手机号码',
      model: 'phonenumber',
    },
  ],
  operations: [
    {
      default: '添加用户',
      onClick: () => {
        const selectUserRef = ref<InstanceType<typeof SelectUser> | null>(null)

        $confirm({
          body: () =>
            h(SelectUser, {
              ref: selectUserRef,
              roleId: props.roleId,
              tableCol,
            }),
          header: '选择用户',
          onConfirmCallback: async () => {
            await selectUserRef.value!.handleSubmit()
            await pageListRef.value!.query()
          },
          width: 1000,
        })
      },
      permission: 'system:role:add',
    },
    reactive({
      default: '批量取消授权',
      disabled: computed(() => selectedRowKeys.value.length === 0),
      onClick: async () => {
        await $confirm('是否给选中用户取消授权当前角色?')
        await alovaInst.Put(
          'system/role/authUser/cancelAll',
          {},
          {
            params: {
              roleId: props.roleId,
              userIds: selectedRowKeys.value.join(','),
            },
          },
        )
        $msg.success('取消授权成功')
        pageListRef.value!.query()
      },
      permission: 'system:role:remove',
    }),
  ],
  tableOtherProps: {
    flexHeight: false,
    rowKey: 'userId',
    showColumnConfigBtn: false,
    showRowSelect: 'multiple',
    showToggleFullscreenBtn: false,
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
