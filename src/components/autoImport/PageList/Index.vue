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
  // {
  //   _label: '计划类型',
  //   component: 'TSelect',
  //   dicCode: 'plan_type',
  //   model: 'planType',
  // },
]
const value1 = ref(['1'])
const options = ref([
  {
    label: '选项1',
    value: '1',
  },
  {
    label: '选项2',
    value: '2',
  },
])
const compo = _Select
const compoRef = ref<InstanceType<typeof _Select>>()

onMounted(() => {
  console.log(compoRef.value)
})

const popupVisible = ref(false)
const inputValue = ref('')
</script>

<template>
  <TCard>
    <TForm :data="formData" :items="formItems"></TForm>
    <TSelect v-model="value1" :options="options" :show-check-all="true" :multiple="true"></TSelect>
    <component
      :is="compo"
      ref="compoRef"
      v-model="value1"
      :show-check-all="true"
      :multiple="true"
      :options="options"
    ></component>
  </TCard>
</template>
