import type { CreateDialogFnType } from './$dialog'

export default (
  arg1:
    | (Omit<Parameters<CreateDialogFnType>[0], 'onCancel' | 'onConfirm'> & {
        onCancelCallback?: () => Promise<void> | void
        onConfirmCallback?: () => Promise<void> | void
      })
    | string,
  arg2?: Parameters<CreateDialogFnType>[1],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dialogInstance =
      typeof arg1 === 'string'
        ? $dialog(
            {
              body: arg1,
              onCancel: () => {
                dialogInstance.hide()
                reject(new Error('confirm_cancel'))
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
              // eslint-disable-next-line ts/no-misused-promises
              onCancel: async () => {
                await arg1.onCancelCallback?.()
                dialogInstance.hide()
                reject(new Error('confirm_cancel'))
              },
              onConfirm: async () => {
                await arg1.onConfirmCallback?.()
                dialogInstance.hide()
                resolve()
              },
              ...arg1,
            },
            arg2,
          )
  })
}
