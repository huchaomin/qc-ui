<script setup lang="ts">
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import captcha from '@/plugins/captcha'
import LoginBg from './modules/LoginBg.vue'

const loginStore = useLoginStore()
const form = ref<FormInstanceFunctions>()
const appName = import.meta.env.VITE_APP_NAME
const formData = reactive({
  password: '',
  rememberMe: true,
  username: '',
})

async function initLoginData() {
  formData.username = await aesDecrypt(loginStore.username)
  formData.password = await aesDecrypt(loginStore.password)
  formData.rememberMe = loginStore.rememberMe
}

initLoginData()
const useCaptcha = import.meta.env.VITE_USE_CAPTCHA

async function onSubmit() {
  if (formData.username === '') {
    $msg.error('请输入账户名')
    return
  }

  if (formData.password === '') {
    $msg.error('请输入密码')
  }

  if (useCaptcha) {
    await captcha()
  }
  else {
    // loginSubmit(formData)
  }
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
    <TForm ref="form" :data="formData" :items="formItems" @submit="onSubmit">
      <template #submitBtn>
        <TButton type="submit" block size="large">登录</TButton>
      </template>
    </TForm>
  </LoginBg>
</template>
