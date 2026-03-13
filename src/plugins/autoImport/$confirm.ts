import type { CreateDialogFnType } from './$dialog'

export default (
  arg1:
    | (Omit<Parameters<CreateDialogFnType>[0], 'onCancel' | 'onConfirm'> & {
        onCancelCallback?: () => Promise<void> | void
        onConfirmCallback?: () => Promise<void> | void
        useReject?: boolean
      })
    | string,
  arg2?: Parameters<CreateDialogFnType>[1],
): Promise<void> => {
  const obj = {
    ...(typeof arg1 === 'string' ? {} : arg1),
  }

  delete obj.useReject
  delete obj.onCancelCallback
  delete obj.onConfirmCallback
  return new Promise((resolve, reject) => {
    const dialogInstance =
      typeof arg1 === 'string'
        ? $dialog(
            {
              body: arg1,
              onCancel: () => {
                dialogInstance.hide()
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
              ...obj,
              onCancel: void (async () => {
                await arg1.onCancelCallback?.()
                dialogInstance.hide()

                if (arg1.useReject === true) {
                  reject(new Error('confirm_cancel'))
                }
              }),
              onConfirm: async () => {
                await arg1.onConfirmCallback?.()
                dialogInstance.hide()
                resolve()
              },
            },
            arg2,
          )
  })
}
