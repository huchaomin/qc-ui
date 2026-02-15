export interface LoginData {
  code?: string
  password: string
  username: string
}

function loginMethod(data: LoginData) {
  return alovaInst.Post<{
    token: string
  }>('login', data, {
    meta: {
      useLoading: '登录中...',
      useToken: false,
    },
  })
}

function logoutMethod() {
  return alovaInst.Post('logout', undefined, {
    meta: {
      useLoading: '退出登录中...',
      useSuccessMsg: true,
    },
  })
}

export default defineStore(
  'login',
  () => {
    const token = ref('')
    const route = useRoute()
    const router = useRouter()

    async function login(data: LoginData) {
      const res = await loginMethod(data)

      token.value = res.token
      await useUserStore().getUserInfo()
    }

    function clearSession() {
      token.value = ''
      useExcludeKPnameStore().clear()
      useRouterStore().clear()
      useUserStore().clear()
      useClearDic()
    }

    // 用户手动跳转到登录
    watch(
      () => route.name, // 只能监听 route.name
      () => {
        if (route.name === 'Login') {
          void clearSession()
        }
      },
      {
        immediate: true,
      },
    )

    async function logout() {
      await logoutMethod()
      await router.push({ name: 'Login' })
      clearSession()
    }

    return {
      login,
      logout,
      token,
    }
  },
  {
    persist: {
      pick: ['token'],
    },
  },
)
