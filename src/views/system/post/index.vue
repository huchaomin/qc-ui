<script setup lang="ts">
const config: PageListConfigType = {
  formProps: {
    data: {
      postCode: '',
      postName: '',
      status: '',
    },
    items: [
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
  },
}
</script>

<template>
  <PageList v-bind="config"></PageList>
</template>
