<script setup lang="ts">
import type { LoginData } from '@/store/modules/login'
import captcha from '@/plugins/captcha'
import LoginBg from './modules/LoginBg.vue'

const loginStore = useLoginStore()
const router = useRouter()
const appName = VITE_APP_NAME
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

async function loginSubmit(formData: LoginData) {
  await loginStore.login(formData)

  if (formData.rememberMe) {
    await loginStore.storeLoginData({
      password: formData.password,
      rememberMe: formData.rememberMe,
      username: formData.username,
    })
  } else {
    loginStore.clearLoginData()
  }

  router.replace({ name: 'Index' })
}

async function onSubmit() {
  if (formData.username === '') {
    $msg.error('请输入账户名')
    return
  }

  if (formData.password === '') {
    $msg.error('请输入密码')
    return
  }

  if (VITE_USE_LOGIN_CAPTCHA) {
    formData.code = await captcha()
    loginSubmit(formData)
  } else {
    loginSubmit(formData)
  }
}

const formItems: FormItemType[] = [
  {
    _label: '账户',
    clearable: false,
    model: 'username',
    placeholder: '账号',
    prefixIcon(h) {
      return h(resolveComponent('icon'), {
        icon: 'mdi:shield-account-outline',
      })
    },
    size: 'large',
  },
  {
    _label: '密码',
    clearable: false,
    model: 'password',
    placeholder: '密码',
    prefixIcon(h) {
      return h(resolveComponent('icon'), {
        icon: 'mdi:password-outline',
      })
    },
    size: 'large',
    type: 'password',
  },
  {
    component: 'TCheckbox',
    label: '记住密码',
    model: 'rememberMe',
  },
  {
    slot: 'submitBtn',
  },
]
</script>

<template>
  <LoginBg>
    <GradientText
      :text="appName"
      :animation-speed="8"
      :show-border="false"
      :colors="['#000000', '#444951', '#8791a1']"
      class-name="text-center text-2xl !font-bold mt-8"
    />
    <TForm class="!mt-8" :data="formData" :items="formItems" @submit="onSubmit">
      <template #submitBtn>
        <TButton type="submit" block size="large" class="!mt-4">登录</TButton>
      </template>
    </TForm>
  </LoginBg>
</template>
