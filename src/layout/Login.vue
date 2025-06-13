<script setup lang="ts">
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import LoginBg from './modules/LoginBg.vue'

const form = ref<FormInstanceFunctions>()
const appName = import.meta.env.VITE_APP_NAME
const formData = reactive({
  account: '',
  password: '',
})

function onReset() {
  void $msg('重置成功')
}

function onSubmit(...arg: any[]) {
  console.log(arg)
}
</script>

<template>
  <LoginBg>
    <TTypographyTitle level="h2">{{ appName }}</TTypographyTitle>
    <TForm ref="form" :data="formData" :colon="true" :label-width="0" @reset="onReset" @submit="onSubmit">
      <TFormItem name="account">
        <TInput v-model="formData.account" clearable placeholder="请输入账户名">
          <!-- <template #prefix-icon>
            <DesktopIcon></DesktopIcon>
          </template> -->
        </TInput>
      </TFormItem>

      <TFormItem name="password">
        <TInput v-model="formData.password" type="password" clearable placeholder="请输入密码">
          <!-- <template #prefix-icon>
            <LockOnIcon></LockOnIcon>
          </template> -->
        </TInput>
      </TFormItem>

      <TFormItem>
        <TButton theme="primary" type="submit" block>登录</TButton>
      </TFormItem>
    </TForm>
  </LoginBg>
</template>
