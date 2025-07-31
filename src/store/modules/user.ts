interface UserInfo {
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

export default defineStore(
  'user',
  () => {
    const userInfo: Ref<UserInfo> = ref({
      dept: {
        deptName: '',
      },
      needChangePwd: 0, // 是否需要修改密码 0 否， 1 是
      nickName: '',
      userId: '',
      userName: '',
    })
    const permissions: Ref<string[]> = ref([])
    const roles: Ref<string[]> = ref([])

    function clearSession() {} // TODO

    async function getUserInfo() {
      const res = await getUserInfoMethod()
      userInfo.value = res.user
      permissions.value = res.permissions
      roles.value = res.roles
      await useRouterStore().getRouters()
    }

    return {
      clearSession,
      getUserInfo,
    }
  },
)
