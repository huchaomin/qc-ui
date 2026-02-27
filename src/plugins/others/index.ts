window.addEventListener('load', () => {
  const landing: HTMLElement = document.querySelector('#landing')!
  const removeLanding = () => {
    landing.style.opacity = '0'
    setTimeout(() => {
      landing.remove()
    }, 1000)
  }
  const isLoading = $loading.isLoading

  if (isLoading.value) {
    watch(
      isLoading,
      () => {
        removeLanding()
      },
      {
        once: true,
      },
    )
  } else {
    removeLanding()
  }
})
window.addEventListener(
  'unhandledrejection',
  function (event) {
    // 空的reject
    if (event.reason === undefined) {
      event.preventDefault() // 去掉控制台的显示异常
      return
    }

    if (event.reason instanceof Error) {
      if (event.reason.message === 'confirm_cancel') {
        event.preventDefault() // 去掉控制台的显示异常
        return
      }
    }

    if (_isPlainObject(event.reason)) {
      if (
        Object.values(event.reason as Record<string, any>).some(
          (v) => Array.isArray(v) && v.some((item: Record<string, any>) => item.result === false),
        )
      ) {
        event.preventDefault() // 去掉控制台的显示异常
      }
    }
  },
  true,
)
