import ResetPwd from '@/layout/profile/ResetPwd.vue'

interface UserInfo {
  admin: boolean
  dept: {
    deptName: string
  }
  needChangePwd: number
  nickName: string
  userId: string
  userName: string
}

export function getUserInfoMethod() {
  return alovaInst.Get<{
    permissions: string[]
    roles: string[]
    user: UserInfo
  }>('getInfo', {
    meta: {
      useFailMsg: '获取用户信息失败',
      useLoading: '正在获取用户信息...',
    },
  })
}

const defaultUserInfo: UserInfo = {
  admin: false,
  dept: {
    deptName: '',
  },
  needChangePwd: 0, // 是否需要修改密码 0 否， 1 是
  nickName: '',
  userId: '',
  userName: '',
}

export default defineStore(
  'user',
  () => {
    const userInfo: Ref<UserInfo> = ref(_.cloneDeep(defaultUserInfo))
    const permissions: Ref<string[]> = ref([])
    const roles: Ref<string[]> = ref([])

    function clear() {
      userInfo.value = _.cloneDeep(defaultUserInfo)
      permissions.value = []
      roles.value = []
    }

    const isAdmin = computed(() => userInfo.value.admin)
    const lastUserId = ref('')

    async function getUserInfo(getRouters = true) {
      const res = await getUserInfoMethod()

      userInfo.value = res.user

      if (lastUserId.value !== userInfo.value.userId) {
        useRecentRoutersStore().clear()
      }

      lastUserId.value = userInfo.value.userId
      permissions.value = res.permissions
      roles.value = res.roles

      if (getRouters) {
        await useRouterStore().getRouters()
      }
    }

    watch(
      () => userInfo.value.needChangePwd,
      (val) => {
        if (val === 1 && VITE_FORCE_PWD_CHANGE) {
          void nextTick(() => {
            const resetPwdRef = ref<InstanceType<typeof ResetPwd> | null>(null)

            void $confirm({
              body: () =>
                h(ResetPwd, {
                  labelAlign: 'top',
                  ref: resetPwdRef,
                  showFooter: false,
                }),
              cancelBtn: null,
              header: '请修改密码',
              onConfirmCallback: async () => {
                await resetPwdRef.value!.handleSubmit()
              },
              width: 430,
            })
          })
        }
      },
      {
        immediate: true,
      },
    )
    return {
      clear,
      getUserInfo,
      isAdmin,
      lastUserId, // 只有return 出去才会被 pick 到
      permissions,
      roles,
      userInfo,
    }
  },
  {
    persist: {
      pick: ['lastUserId'],
    },
  },
)
