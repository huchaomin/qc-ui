import { useCookies } from '@vueuse/integrations/useCookies'

const { getAll, remove } = useCookies()
const cookies = getAll<Record<string, any>>()

Object.keys(cookies).forEach((key) => {
  remove(key)
})
