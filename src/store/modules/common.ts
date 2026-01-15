interface AppInfo {
  appName: string
  version: string
}

function getAppInfoMethod() {
  return alovaInst.Get<AppInfo>('common/appInfo', {
    meta: {
      useFailMsg: false,
      useLoading: false,
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

    function getAppInfo() {
      getAppInfoMethod()
        .then((res) => {
          appInfo.value = res
        })
        .catch((e) => {
          console.log(`${VITE_APP_NAME} 获取应用信息失败`, e)
        })
    }

    const isRequestSleep = ref(true)
    let timer: null | number = null

    function requestActive(): void {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }

      isRequestSleep.value = false
      timer = setTimeout(
        () => {
          isRequestSleep.value = true
        },
        1000 * 60 * 15,
      )
    }

    return {
      appInfo,
      drawerOpen,
      getAppInfo,
      isRequestSleep,
      requestActive,
    }
  },
  {
    persist: {
      pick: ['drawerOpen'],
    },
  },
)
