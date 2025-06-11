import 'alova'

// https://github.com/vitejs/vite/discussions/9431
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent

  export default component
}
declare module 'alova' {
  export interface AlovaCustomTypes {
    meta: {
      use600Alert: boolean
      useDataResult: boolean
      useDownload?: string
      useEmptyData: boolean
      useEmptyParams: boolean
      useFailMsg: boolean
      useFormData: boolean
      useLoading: boolean
      useResponseBlob: boolean
      useSuccessMsg: boolean
      useToken: boolean
    }
  }
}
