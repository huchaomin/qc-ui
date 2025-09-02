export default (): Promise<string> => {
  return new Promise((resolve) => {
    const dialogInstance = $dialog({
      body: () =>
        h(
          defineAsyncComponent(() => import('./Entry.vue')),
          {
            onSuccess: (captchaVerification: string) => {
              dialogInstance.hide()
              resolve(captchaVerification)
            },
          },
        ),
      footer: false,
      header: '请完成安全验证',
    })
  })
}
