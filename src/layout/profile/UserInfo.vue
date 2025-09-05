<script setup lang="ts">
const formData = reactive({
  password: '',
  rememberMe: true,
  username: '',
})
const formItems: FormItemType[] = [
  {
    componentProps: {
      clearable: false,
      placeholder: '账号',
      prefixIcon(h) {
        return h(resolveComponent('icon'), {
          icon: 'mdi:shield-account-outline',
        })
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
        return h(resolveComponent('icon'), {
          icon: 'mdi:password-outline',
        })
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
  <TForm :data="formData" :items="formItems"></TForm>
</template>
