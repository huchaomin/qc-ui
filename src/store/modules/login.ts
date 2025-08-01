export interface LoginData {
  code?: string
  password: string
  rememberMe: boolean
  username: string
}

function loginMethod(data: LoginData) {
  return alovaInst.Post<{
    token: string
  }>('login', data, {
    meta: {
      useFailMsg: '登录失败',
      useLoading: '登录中...',
      useToken: false,
    },
  })
}

export default defineStore(
  'login',
  () => {
    const username = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const token = ref('')

    async function login(data: LoginData) {
      const res = await loginMethod(data)
      token.value = res.token
      await useUserStore().getUserInfo()
    }

    async function storeLoginData(data: Omit<LoginData, 'code'>) {
      username.value = await aesEncrypt(data.username)
      password.value = await aesEncrypt(data.password)
      rememberMe.value = data.rememberMe
    }

    async function clearLoginData() {
      username.value = ''
      password.value = ''
      rememberMe.value = false
    }

    return {
      clearLoginData,
      login,
      password,
      rememberMe,
      storeLoginData,
      token,
      username,
    }
  },
  {
    persist: {
      pick: ['username', 'password', 'rememberMe', 'token'],
    },
  },
)
