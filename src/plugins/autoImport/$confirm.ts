import type { CreateDialogFnType } from './$dialog'

export default (
  arg1:
    | Omit<Parameters<CreateDialogFnType>[0], 'onClose' | 'onConfirm'>
    | string,
  arg2?: Parameters<CreateDialogFnType>[1],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const config = {
      closeBtn: false,
      theme: 'warning',
    } as const
    const dialogInstance =
      typeof arg1 === 'string'
        ? $dialog(
            {
              body: arg1,
              onClose: () => {
                dialogInstance.hide()
                reject()
              },
              onConfirm: () => {
                dialogInstance.hide()
                resolve()
              },
              ...config,
            },
            arg2,
          )
        : $dialog(
            {
              onClose: () => {
                dialogInstance.hide()
                reject()
              },
              onConfirm: () => {
                dialogInstance.hide()
                resolve()
              },
              ...config,
              ...arg1,
            },
            arg2,
          )
  })
}
