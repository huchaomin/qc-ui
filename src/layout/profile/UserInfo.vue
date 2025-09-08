<script setup lang="ts">
const formData = reactive({
  sex: '0',
})
const formItems: FormItemType[] = [
  {
    _label: '用户昵称',
    maxlength: 30,
    model: 'nickName',
  },
  {
    _label: '手机号码',
    maxlength: 11,
    model: 'phonenumber',
  },
  {
    _label: '邮箱',
    maxlength: 50,
    model: 'email',
  },
  {
    _label: '性别',
    component: 'TRadioGroup',
    model: 'sex',
    options: useDicOptions('sys_user_sex', ['0', '1']),
  },
  {
    slot: 'footer',
  },
]
</script>

<template>
  <TForm :data="formData" :items="formItems"></TForm>
</template>
