<script setup lang="ts">
const config: PageListProps = {
  apis: {
    list: {
      method: 'system/post/list',
    },
  },
  columns: [
    {
      colKey: 'postId',
      title: '岗位编号',
    },
    {
      colKey: 'postCode',
      title: '岗位编码',
    },
    {
      colKey: 'postName',
      title: '岗位名称',
    },
    {
      colKey: 'postSort',
      title: '岗位排序',
    },
    {
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
  ],
  formItems: [
    {
      _label: '岗位编码',
      model: 'postCode',
    },
    {
      _label: '岗位名称',
      model: 'postName',
    },
    {
      _label: '状态',
      component: 'TSelect',
      dicCode: 'sys_normal_disable',
      model: 'status',
    },
  ],
  initialFormData: {
    postCode: '',
    postName: '',
    status: '',
  },
}
</script>

<template>
  <PageList v-bind="config"></PageList>
</template>
