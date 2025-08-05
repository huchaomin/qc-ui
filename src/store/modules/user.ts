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

    async function getUserInfo() {
      const res = await getUserInfoMethod()
      userInfo.value = res.user
      permissions.value = res.permissions
      roles.value = res.roles
      await useRouterStore().getRouters()
    }

    return {
      clear,
      getUserInfo,
      isAdmin,
      permissions,
      roles,
      userInfo,
    }
  },
)
