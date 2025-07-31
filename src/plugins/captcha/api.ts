import type { Arg } from 'alova'

const PREFIX = 'captcha'

export function checkCaptcha(data: Arg) {
  return alovaInst.Post<Record<string, any>>(`${PREFIX}/check`, data, {
    meta: {
      useLoading: false,
      useToken: false,
    },
  })
}

export function getCaptcha(data: Arg) {
  return alovaInst.Post<Record<string, any>>(`${PREFIX}/get`, data, {
    meta: {
      useLoading: false,
      useToken: false,
    },
  })
}
