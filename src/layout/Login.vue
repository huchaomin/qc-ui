<script setup lang="ts">
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import LoginBg from './modules/LoginBg.vue'

const form = ref<FormInstanceFunctions>()
const appName = import.meta.env.VITE_APP_NAME
const formData = reactive({
  password: '',
  rememberMe: true,
  username: '',
})

function onReset() {
  void $msg('重置成功')
}

function onSubmit(...arg: any[]) {
  console.log(arg)
}

const formItems: FormItemType[] = [
  {
    componentProps: {
      clearable: false,
      placeholder: '账号',
      prefixIcon(h) {
        return h(resolveComponent('i-mdi:account-circle-outline'))
      },
      size: 'large',
    },
    formItemProps: {
      label: '账户',
    },
    model: 'username',
  },
  {
    componentProps: {
      autocomplete: 'on',
      clearable: false,
      placeholder: '密码',
      prefixIcon(h) {
        return h(resolveComponent('i-solar:lock-password-linear'))
      },
      size: 'large',
      type: 'password',
    },
    formItemProps: {
      label: '密码',
    },
    model: 'password',
  },
  {
    component: 'TCheckbox',
    componentProps: {
      label: '记住密码',
    },
    model: 'rememberMe',
  },
  {
    slot: 'submitBtn',
  },
]
</script>

<template>
  <LoginBg>
    <TTypographyTitle level="h2">{{ appName }}</TTypographyTitle>
    <TForm ref="form" :data="formData" :items="formItems" @reset="onReset" @submit="onSubmit">
      <template #submitBtn>
        <TButton type="submit" block size="large">登录</TButton>
      </template>
    </TForm>
  </LoginBg>
</template>
