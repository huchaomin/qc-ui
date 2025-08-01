<script setup lang="ts">
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import type { LoginData } from '@/store/modules/login'
import captcha from '@/plugins/captcha'
import LoginBg from './modules/LoginBg.vue'

const loginStore = useLoginStore()
const router = useRouter()
const form = ref<FormInstanceFunctions>()
const appName = import.meta.env.VITE_APP_NAME
const formData = reactive<LoginData>({
  password: '',
  rememberMe: true,
  username: '',
})

async function initLoginData() {
  formData.username = await aesDecrypt(loginStore.username)
  formData.password = await aesDecrypt(loginStore.password)
}

if (loginStore.rememberMe) {
  initLoginData()
}

const useCaptcha = import.meta.env.VITE_USE_CAPTCHA

async function loginSubmit(formData: LoginData) {
  await loginStore.login(formData)

  if (formData.rememberMe) {
    await loginStore.storeLoginData({
      password: formData.password,
      rememberMe: formData.rememberMe,
      username: formData.username,
    })
  }
  else {
    loginStore.clearLoginData()
  }

  router.replace({ name: 'Index' })
}

async function onSubmit() {
  if (formData.username === '') {
    $msg.error('请输入账户名')
    await Promise.reject()
  }

  if (formData.password === '') {
    $msg.error('请输入密码')
    await Promise.reject()
  }

  if (useCaptcha) {
    formData.code = await captcha()
    loginSubmit(formData)
  }
  else {
    loginSubmit(formData)
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
    <TTypographyTitle level="h2" class="text-center">{{ appName }}</TTypographyTitle>
    <TForm ref="form" class="!mt-8" :data="formData" :items="formItems" @submit="onSubmit">
      <template #submitBtn>
        <TButton type="submit" block size="large" class="!mt-4">登录</TButton>
      </template>
    </TForm>
  </LoginBg>
</template>
