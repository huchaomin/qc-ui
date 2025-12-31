import 'alova'
import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * @description: 是否全屏显示 默认 false
     */
    fullScreen: boolean
    /**
     * @description: 是否左侧在菜单中隐藏 默认 false
     */
    hidden: boolean
    /**
     * @description: 菜单icon
     */
    icon: string
    /**
     * @description: 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
     */
    noCache: boolean
    /**
     * @description: 父级路由名称
     */
    parentName: string
    /**
     * @description: 路由标题
     */
    title: string
  }
}
declare module 'alova' {
  export interface AlovaCustomTypes {
    meta: {
      /**
       * 是否使用600弹窗 默认true
       */
      use600Alert?: boolean
      /**
       * 是否使用返回数据里面的data 默认true
       */
      useDataResult?: boolean
      /**
       * 如果为false 则不下载，自己处理返回的 blob, 默认
       * 如果为true 则从响应头获取文件名,并下载
       * 如果为string 则使用string作为文件名,并下载
       */
      useDownload?: boolean | string
      /**
       * 是否去除请求参数 params 里面 isFalsy 的值， 默认true
       */
      useEmptyParams?: boolean
      /**
       * 接口调用失败是否弹出 msg 默认true
       * 如果传string的话，失败就弹出string
       */
      useFailMsg?: boolean | string
      /**
       * 是否使用formData 默认false
       */
      useFormData?: boolean
      /**
       * 请求接口时是否使用loading 默认true
       * 如果为string 则使用 string 作为 loading 的文本
       * 如果为false 则不使用loading
       */
      useLoading?: boolean | string
      /**
       * 响应体是否为blob类型 默认false
       */
      useResponseBlob?: boolean
      /**
       * 接口调用成功是否弹出 msg 默认false
       */
      useSuccessMsg?: boolean
      /**
       * 是否在请求头添加 token 默认true
       */
      useToken?: boolean
    }
  }
}
