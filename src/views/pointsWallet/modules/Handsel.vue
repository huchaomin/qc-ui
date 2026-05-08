<script lang="ts" setup>
const emit = defineEmits<{
  update: []
}>()
const formData = reactive<Record<string, any>>({})
const formItems: FormItem[] = [
  {
    _label: '赠送积分',
    _required: true,
    component: 'TInputNumber',
    model: 'points',
  },
  {
    _class: 'col-span-2',
    _label: '赠送用户',
    _rules: [
      {
        message: '请选择赠送用户',
        required: true,
      },
    ],
    component: 'SelectSysUser',
    max: 1,
    model: 'employeeId',
  },
]
const formRef = useTemplateRef('formRef')

async function handleHandsel() {
  const data = await formRef.value!.validate()

  await alovaInst.Post('yq/pointsWallet/pointsGive', {
    ...data,
    employeeId: data.employeeId[0],
  })
  void $msg('积分赠送成功')
  emit('update')
}
</script>

<template>
  <TCard class="mx-1! mb-1!" title="积分赠送" :header-bordered="false" header-class-name="pb-0!">
    <TForm ref="formRef" :data="formData" :items="formItems"></TForm>
    <div class="mt-4 text-center">
      <TButton @click="handleHandsel">确认赠送</TButton>
    </div>
  </TCard>
</template>
