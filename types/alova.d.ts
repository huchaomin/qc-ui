import 'alova'

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
