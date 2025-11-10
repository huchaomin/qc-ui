<script setup lang="ts">
const { showFooter = true } = defineProps<{
  showFooter?: boolean
}>()
const route = useRoute()
const formData = reactive({
  confirmPassword: '',
  newPassword: '',
  oldPassword: '',
})
const formItems: FormItemType[] = [
  {
    _label: '旧密码',
    _required: true,
    model: 'oldPassword',
    type: 'password',
  },
  {
    _label: '新密码',
    _required: true,
    _rules: [
      {
        message: '密码必须为8位或8位以上的必须包含(数字、大写字母、小写字母)的组合',
        pattern: passwordReg,
      },
    ],
    model: 'newPassword',
    type: 'password',
  },
  {
    _label: '确认密码',
    _required: true,
    _rules: [
      {
        validator: (val) => {
          if (val === formData.newPassword) {
            return true
          }

          return {
            message: '两次输入的密码不一致',
            result: false,
          }
        },
      },
    ],
    model: 'confirmPassword',
    type: 'password',
  },
  ...(showFooter
    ? [
        {
          slot: 'footer',
        },
      ]
    : []),
]
const formRef = useTemplateRef('form')

function handleClose() {
  useRecentRoutersStore().close(route.name)
}

async function handleSubmit() {
  await formRef.value!.validate()
  await alovaInst.Put('system/user/profile/updatePwd', undefined, {
    meta: {
      useLoading: '保存中...',
      useSuccessMsg: true,
    },
    params: {
      newPassword: formData.newPassword,
      oldPassword: formData.oldPassword,
    },
  })
  useLoginStore().logout()
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <TForm ref="form" :data="formData" :items="formItems" layout="vertical" label-align="right">
    <template #footer>
      <TButton @click="handleSubmit">保存</TButton>
      <TButton theme="default" class="!ml-4" @click="handleClose">关闭</TButton>
    </template>
  </TForm>
</template>
