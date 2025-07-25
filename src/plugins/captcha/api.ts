import type { Arg } from 'alova'
import alova from '@/plugins/alova'

const PREFIX = 'captcha'

export function checkCaptcha(data: Arg) {
  return alova.Post<Record<string, any>>(`${PREFIX}/check`, data, {
    meta: {
      useLoading: false,
      useToken: false,
    },
  })
}

export function getCaptcha(data: Arg) {
  return alova.Post<Record<string, any>>(`${PREFIX}/get`, data, {
    meta: {
      useLoading: false,
      useToken: false,
    },
  })
}
