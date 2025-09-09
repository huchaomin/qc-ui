<script setup lang="ts">
import type { FormProps } from 'tdesign-vue-next'

const formData = reactive({
  sex: '0',
})
const formItems: FormItemType[] = [
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
    _label: ' ',
    slot: 'footer',
  },
]
const handleSubmit: FormProps['onSubmit'] = ({
  firstError,
  validateResult,
}) => {
  console.log(firstError, validateResult)
}
</script>

<template>
  <TForm
    :data="formData"
    :items="formItems"
    layout="vertical"
    label-align="right"
    @submit="handleSubmit"
  >
    <template #footer>
      <TButton type="submit">保存</TButton>
      <TButton theme="default" class="!ml-4">关闭</TButton>
    </template>
  </TForm>
</template>
