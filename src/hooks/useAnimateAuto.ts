import _autoAnimate from '@formkit/auto-animate'

export default () => {
  const animationDisposer = ref<null | ReturnType<typeof _autoAnimate>>(null)

  function autoAnimate(...args: Parameters<typeof _autoAnimate>) {
    animationDisposer.value = _autoAnimate(...args)
  }

  onUnmounted(() => {
    if (animationDisposer.value !== null) {
      animationDisposer.value.destroy?.()
    }
  })
  return {
    autoAnimate,
  }
}
