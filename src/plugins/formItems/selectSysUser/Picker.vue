<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    max?: number
    modelValue: string[]
  }>(),
  {},
)
const pageListRef = useTemplateRef('pageListRef')
const config: PageListProps = {
  apis: {
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('system/user/list', {
          params: {
            ...o,
            status: 0,
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
      colKey: 'createTime',
      title: '创建时间',
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
  tableOtherProps: {
    checkSelectedOnDataChange: false,
    flexHeight: false,
    rowKey: 'userId',
    selectedRowKeys: props.modelValue,
    showColumnConfigBtn: false,
    showRowSelect: props.max === 1 ? 'single' : 'multiple',
    showToggleFullscreenBtn: false,
  },
}

async function handleSubmit(): Promise<string[]> {
  const idArr = pageListRef.value!.selectedRowKeys as string[]

  if (idArr.length === 0) {
    $msg.error('请选择用户')
    return Promise.reject()
  }

  if (props.max !== undefined && idArr.length > props.max) {
    $msg.error(`最多选择${props.max}个用户`)
    return Promise.reject()
  }

  return idArr
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <PageList ref="pageListRef" v-bind="config">
    <template v-if="max !== 1" #table-top>
      <TAlert class="p-2!" :message="`已选择 ${pageListRef?.selectedRowKeys.length ?? 0} 个用户`" />
    </template>
  </PageList>
</template>
