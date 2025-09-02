import type { CreateDialogFnType } from './$dialog'

export default (
  arg1:
    | Omit<Parameters<CreateDialogFnType>[0], 'onClose' | 'onConfirm'>
    | string,
  arg2?: Parameters<CreateDialogFnType>[1],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dialogInstance =
      typeof arg1 === 'string'
        ? $dialog(
            {
              body: arg1,
              closeBtn: false,
              onClose: () => {
                dialogInstance.hide()
                reject()
              },
              onConfirm: () => {
                dialogInstance.hide()
                resolve()
              },
              theme: 'warning',
            },
            arg2,
          )
        : $dialog(
            {
              closeBtn: false,
              onClose: () => {
                dialogInstance.hide()
                reject()
              },
              onConfirm: () => {
                dialogInstance.hide()
                resolve()
              },
              theme: 'warning',
              ...arg1,
            },
            arg2,
          )
  })
}
