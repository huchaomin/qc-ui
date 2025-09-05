import type { DialogInstance, DialogOptions } from 'tdesign-vue-next'
import type { AppContext } from 'vue'

enum DialogCreateType {
  alert = 'alert',
  confirm = 'confirm',
}

export type CreateDialogFnType = (
  options: Omit<DialogOptions, 'default'>,
  context?: AppContext,
) => DialogInstance
type CreateDialogType = CreateDialogFnType & {
  [value in DialogCreateType]: CreateDialogFnType
}

function create(
  type: `${DialogCreateType}` | undefined,
  options: Parameters<CreateDialogFnType>[0],
  context: Parameters<CreateDialogFnType>[1],
) {
  const obj = {
    closeOnEscKeydown: false,
    closeOnOverlayClick: false,
    destroyOnClose: true,
    draggable: true,
    header: '提示',
    placement: 'center' as const,
    width: 'fit-content',
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
