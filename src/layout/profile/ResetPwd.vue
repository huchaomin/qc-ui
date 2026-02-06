<script setup lang="ts">
const { showFooter = true } = defineProps<{
  showFooter?: boolean
}>()
const loginStore = useLoginStore()
const route = useRoute()
const formItems: FormItem[] = [
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
        message: loginStore.passwordRegMessage,
        pattern: loginStore.passwordReg,
      },
    ],
    model: 'newPassword',
    type: 'password',
  },
  (formData) => ({
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
  }),
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
  const formData = await formRef.value!.validate()

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
  <TForm ref="form" :items="formItems" layout="vertical" label-align="right">
    <template #footer>
      <TButton @click="handleSubmit">保存</TButton>
      <TButton theme="default" class="ml-4!" @click="handleClose">关闭</TButton>
    </template>
  </TForm>
</template>
