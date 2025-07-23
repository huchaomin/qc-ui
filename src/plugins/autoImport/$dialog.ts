import type { DialogInstance, DialogOptions } from 'tdesign-vue-next'
import type { AppContext } from 'vue'

enum DialogCreateType {
  alert = 'alert',
  confirm = 'confirm',
}

export type CreateDialogFnType = (
  body: DialogOptions['body'],
  options?: Omit<DialogOptions, 'body' | 'default'>,
  context?: AppContext
) => DialogInstance
type CreateDialogType = CreateDialogFnType
  & {
    [value in DialogCreateType]: CreateDialogFnType
  }

function create(
  type: `${DialogCreateType}` | undefined,
  body: Parameters<CreateDialogFnType>[0],
  options: Parameters<CreateDialogFnType>[1],
  context: Parameters<CreateDialogFnType>[2],
) {
  const obj = {
    body,
    ...(options ?? {}),
  }

  if (type === undefined) {
    return DialogPlugin(obj, context)
  }

  return DialogPlugin[type](obj, context)
}

const createDialog: CreateDialogType = function (...arg) {
  return create(undefined, ...arg)
} as CreateDialogType
Object.values(DialogCreateType).forEach((type) => {
  createDialog[type] = (...arg) => {
    return create(type, ...arg)
  }
})

export default createDialog
