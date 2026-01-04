import { useCookies } from '@vueuse/integrations/useCookies'

const { getAll, remove } = useCookies()
const cookies = getAll<Record<string, any>>()

Object.keys(cookies).forEach((key) => {
  remove(key)
})
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
