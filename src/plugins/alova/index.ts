import type { AlovaCustomTypes, Arg } from 'alova'
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'
import sysPath from 'path-browserify'

const TIMEOUT = 15000
const NETWORK_ERR_MSG = '网络错误，请稍后再试'
type ThisAlovaCustomTypes = Required<AlovaCustomTypes['meta']> & {
  useDownload?: boolean | string
}

export default createAlova({
  baseURL: sysPath.join(import.meta.env.VITE_BASE_URL, import.meta.env.VITE_API_PREFIX),
  // 请求前拦截器 可以为异步函数
  beforeRequest(method) {
    method.meta = {
      ...{
        use600Alert: true,
        useDataResult: true,
        useEmptyData: false,
        useEmptyParams: true,
        useFailMsg: true,
        useFormData: false,
        useLoading: true,
        useResponseBlob: false,
        useSuccessMsg: false,
        useToken: true,
      },
      ...(method.meta ?? {}),
    }
    const loginStore = useLoginStore()
    const { useEmptyData, useEmptyParams, useFormData, useLoading, useToken } = method.meta as ThisAlovaCustomTypes

    if (useToken) {
      if (loginStore.token) {
        method.config.headers.Authorization = loginStore.token
      }
      else {
        method.abort()
      }
    }

    if (useLoading !== false) {
      $loading.show(useLoading === true ? undefined : useLoading)
    }

    // 处理 params 参数
    const params = method.config.params

    if (typeof params !== 'string') {
      const paramsCopy: Record<string, any> = {}
      Object.keys(params).forEach((key: string) => {
        if (_.isNumber(params[key]) || _.isString(params[key]) || _.isBoolean(params[key]) || !useEmptyParams) {
          paramsCopy[encodeURIComponent(key)] = encodeURIComponent(params[key] as string)
        }
      })
      method.config.params = paramsCopy
    }

    // 处理 data 参数
    if (useEmptyData) {
      const obj = {
        ...(method.data as Arg),
      }
      Object.keys(obj).forEach((key: string) => {
        if (isFalsy(obj[key])) {
          delete obj[key]
        }
      })
      method.data = obj
    }

    // 处理 formData 参数
    if (useFormData) {
      const formData = new FormData()
      Object.keys(method.data as Arg).forEach((key: string) => {
        formData.append(key, method.data![key as keyof typeof method.data])
      })
      method.data = formData
    }

    if (method.config.timeout === TIMEOUT && (useFormData || method.data instanceof FormData)) {
      method.config.timeout = 0
    }
  },
  cacheFor: null, // 全局关闭全部请求缓存
  requestAdapter: adapterFetch(),
  responded: {
    // 不论是成功、失败、还是命中缓存
    onComplete: (method) => {
      if ((method.meta as ThisAlovaCustomTypes).useLoading !== false) {
        $loading.hide() // 这个loading 消失的时机
      }
    },

    // 由于window.fetch的特点，只有在连接超时或连接中断时才会触发onError拦截器，其他情况均会触发onSuccess拦截器
    // 这里必须抛出错误, 要不然将认为请求是成功的，且不会获得响应数据(undefined)
    onError: async (err) => {
      if (err instanceof Error) {
        const { message } = err

        // 主动取消请求，不要报错
        if (message.toLowerCase().includes('abort')) {
          return Promise.reject(err)
        }

        if (message.toLowerCase().includes('timeout')) {
          void $msg.error('请求超时')
          return Promise.reject(err)
        }
      }

      void $msg.error(NETWORK_ERR_MSG)
      return Promise.reject(err)
    },

    // 当捕获错误但没有抛出错误或返回 reject 状态的 Promise 实例，将认为请求是成功的，且不会获得响应数据。
    // 代码直接报错那当然，请求是失败的
    onSuccess: async (response, method) => {
      const { headers, ok, status } = response

      // 状态码在 200-299 范围内
      if (ok === false) {
        const map: Record<number, string> = {
          403: '当前操作没有权限',
          404: '访问资源不存在',
          500: '服务不可用，请稍后再试或联系管理员！',
        }
        const m = map[status] ?? NETWORK_ERR_MSG
        void $msg.error(m)
        return Promise.reject(response)
      }

      const { useDataResult, useDownload, useFailMsg, useResponseBlob, useSuccessMsg } = method.meta as ThisAlovaCustomTypes

      // 有时候后端没有返回文件流，而是返回了json数据，这里可能是因为后端返回了错误信息，所以要加上后面的判断
      if (useResponseBlob && !headers.get('content-type')?.includes('application/json')) {
        if (useDownload !== undefined && useDownload !== false) {
          void saveAs(await response.blob(), useDownload as string) // TODO true 从响应头获取文件名
        }

        return response.blob()
      }

      // eslint-disable-next-line ts/no-unsafe-assignment
      const resData = await response.json()

      // eslint-disable-next-line ts/no-unsafe-member-access
      if (resData?.code !== undefined) {
        const { code, msg } = resData as {
          code: number
          msg: string
        }

        if (code >= 400) {
          // 600 的弹窗在普通请求就是成功的， useResponseBlob 请求就是失败的
          if (code === 600) {
            // $alert( // TODO 600 的弹窗 use600Alert
            //   {
            //     content: parseRes.msg,
            //     html: true,
            //   },
            //   {
            //     title: '提示',
            //     width: 660,
            //   },
            // )
            if (!useResponseBlob) {
              // eslint-disable-next-line ts/no-unsafe-return
              return resData
            }
          }
          else if (code === 401) {
            void useLoginStore().clearSession()
          }
          else {
            if (useFailMsg !== false) {
              void $msg.error(useFailMsg === true ? msg : useFailMsg)
            }
          }

          return Promise.reject(resData)
        }
        else {
          if (useSuccessMsg) {
            void $msg(msg)
          }

          // eslint-disable-next-line ts/no-unsafe-return, ts/no-unsafe-member-access
          return useDataResult ? (resData.data === undefined ? resData : resData.data) : resData
        }
      }

      console.log('resData', resData)
      // eslint-disable-next-line ts/no-unsafe-return
      return resData
    },
  },
  shareRequest: true, // 全局开启请求共享,相同请求结果会沿用上一次未完成请求的结果
  statesHook: VueHook,
  timeout: TIMEOUT,
})
