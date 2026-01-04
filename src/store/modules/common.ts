interface AppInfo {
  appName: string
  version: string
}

function getAppInfoMethod() {
  return alovaInst.Get<AppInfo>('common/appInfo', {
    meta: {
      useSysFailMsg: false,
      useToken: false,
    },
  })
}

export default defineStore(
  'common',
  () => {
    const drawerOpen = ref(true)
    const appInfo = ref<AppInfo>({
      appName: VITE_APP_NAME,
      version: '',
    })

    watch(
      () => appInfo.value.appName,
      (val) => {
        if (val) {
          document.title = val
        }
      },
    )

    async function getAppInfo() {
      appInfo.value = await getAppInfoMethod()
    }

    return {
      appInfo,
      drawerOpen,
      getAppInfo,
    }
  },
  {
    persist: {
      pick: ['drawerOpen'],
    },
  },
)
