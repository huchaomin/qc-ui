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

export function getCaptcha() {
  return alovaInst.Post<Record<string, any>>(`${PREFIX}/get`, {}, {
    meta: {
      useLoading: false,
      useToken: false,
    },
  })
}
