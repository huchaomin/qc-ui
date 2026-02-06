<script setup lang="ts">
const emit = defineEmits<{
  update: []
}>()
const route = useRoute()
const userInfo = inject<ComputedRef<Record<string, any> | undefined>>('userInfo')!
const formRef = useTemplateRef('form')

watchEffect(
  () => {
    const val = userInfo.value

    if (val) {
      const formData = formRef.value!.getFormData()

      Object.keys(formData).forEach((key) => {
        if (!isFalsy(val[key])) {
          formData[key as keyof typeof formData] = val[key]
        }
      })
    }
  },
  {
    flush: 'post',
  },
)

const formItems: FormItemType[] = reactive([
  {
    _label: '用户昵称',
    _required: true,
    maxlength: 30,
    model: 'nickName',
  },
  {
    _label: '手机号码',
    _required: true,
    _rules: [
      {
        message: '请填写正确的手机号码',
        telnumber: true,
      },
    ],
    maxlength: 11,
    model: 'phonenumber',
  },
  {
    _label: '邮箱',
    _required: true,
    _rules: [
      {
        email: true,
        message: '请填写正确的邮箱',
      },
    ],
    maxlength: 50,
    model: 'email',
  },
  {
    _label: '性别',
    _required: true,
    component: 'TRadioGroup',
    model: 'sex',
    options: useDicOptions('sys_user_sex', ['0', '1']),
  },
  {
    slot: 'footer',
  },
])

function handleClose() {
  useRecentRoutersStore().close(route.name)
}

async function handleSubmit() {
  const formData = await formRef.value!.validate()

  await alovaInst.Put('system/user/profile', formData, {
    meta: {
      useLoading: '保存中...',
      useSuccessMsg: true,
    },
  })
  useUserStore().getUserInfo(false)
  emit('update')
}
</script>

<template>
  <TForm ref="form" :items="formItems" layout="vertical" label-align="right">
    <template #footer>
      <TButton @click="handleSubmit">保存</TButton>
      <TButton theme="default" class="ml-4!" @click="handleClose">关闭</TButton>
    </template>
  </TForm>
</template>
