<script setup lang="ts">
const formData = reactive({
  amountType: '',
  assignDimension: '',
  id: '',
  pkgGroup: '',
  planName: '',
  planStatus: '',
  planType: '',
  takeSameDebitAway: '',
  templateId: '',
})
const formItems: FormItemType[] = [
  {
    _label: '计划ID',
    model: 'id',
  },
  {
    _label: '计划名称',
    model: 'planName',
  },
  {
    _label: '计划类型',
    model: 'planType',
  },
]
</script>

<template>
  <TCard>
    <TForm :data="formData" :items="formItems"></TForm>
  </TCard>
</template>
