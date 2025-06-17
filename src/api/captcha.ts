import type { Arg } from 'alova'
import alova from '@/plugins/alova'

const PREFIX = 'captcha'

export async function checkCaptcha(data: Arg) {
  return alova.Post(`${PREFIX}/check`, data, {
    meta: {
      useToken: false,
    },
  })
}

export async function getCaptcha(data: Arg) {
  return alova.Post(`${PREFIX}/get`, data, {
    meta: {
      useToken: false,
    },
  })
}
