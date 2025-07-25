export default function (): Promise<void> {
  return new Promise((resolve) => {
    const dialogInstance = $dialog({
      body: () => h(defineAsyncComponent(() => import('./Index.vue')), {
        onSuccess: () => {
          dialogInstance.hide()
          resolve()
        },
      }),
      footer: false,
      header: '请完成安全验证',
    })
  })
}
