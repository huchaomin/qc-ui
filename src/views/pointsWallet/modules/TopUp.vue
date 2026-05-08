<script lang="ts" setup>
const emit = defineEmits<{
  update: []
}>()
const formData = reactive<Record<string, any>>({})
const formItems: FormItem[] = [
  {
    _label: '充值金额',
    _required: true,
    component: 'TInputNumber',
    model: 'amount',
    suffix: '元',
  },
  {
    _label: '充值积分',
    _required: true,
    component: 'TInputNumber',
    model: 'points',
  },
  {
    _class: 'col-span-2',
    _label: '充值用户',
    _rules: [
      {
        message: '请选择充值用户',
        required: true,
      },
    ],
    component: 'SelectSysUser',
    max: 1,
    model: 'employeeId',
  },
]
const formRef = useTemplateRef('formRef')

async function handleTopUp() {
  const data = await formRef.value!.validate()

  await alovaInst.Post('yq/pointsWallet/pointsWalletCharge', {
    ...data,
    employeeId: data.employeeId[0],
  })
  void $msg('充值成功')
  emit('update')
}
</script>

<template>
  <TCard class="mx-1! mb-1!" title="积分充值" :header-bordered="false" header-class-name="pb-0!">
    <TForm ref="formRef" :data="formData" :items="formItems"></TForm>
    <div class="mt-4 text-center">
      <TButton @click="handleTopUp">确认充值</TButton>
    </div>
  </TCard>
</template>
