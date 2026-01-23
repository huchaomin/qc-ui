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
    const passwordReg =
      // eslint-disable-next-line regexp/no-obscure-range
      /^(?=[!-~]{8,}$)(?:(?=.*[A-Z])(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])).+$/
    const passwordRegMessage = '密码8位及以上，含大写字母、小写字母、数字、特殊字符中至少三类'
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
      passwordReg,
      passwordRegMessage,
      token,
    }
  },
  {
    persist: {
      pick: ['token'],
    },
  },
)
