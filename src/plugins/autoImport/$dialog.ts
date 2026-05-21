import type { DialogInstance, DialogOptions } from 'tdesign-vue-next'
import type { AppContext, Ref } from 'vue'

enum DialogCreateType {
  alert = 'alert',
  closeAll = 'closeAll',
  confirm = 'confirm',
}

export type CreateDialogFnType = (
  options: {
    /**
     * @description: 关闭所有的时候是不是也关闭这个弹窗
     */
    closeWhenCloseAll?: boolean
  } & Omit<DialogOptions, 'default' | 'onConfirm'> & {
      onConfirm?:
        | ((...args: Parameters<NonNullable<DialogOptions['onConfirm']>>) => Promise<void>)
        | DialogOptions['onConfirm']
    },
  context?: AppContext,
) => DialogInstance

type CreateDialogType = CreateDialogFnType &
  Omit<
    {
      [value in DialogCreateType]: CreateDialogFnType
    },
    'closeAll'
  > & {
    closeAll: () => void
  }

const dialogs = new Set<DialogInstance>()

/**
 * @description: cancel、escKeydown、closeBtnClick、overlayClick 如果允许弹窗关闭的话，最后都会触发 close 事件
 */
function create(
  type: `${Exclude<DialogCreateType, 'closeAll'>}` | undefined,
  _options: Parameters<CreateDialogFnType>[0],
  context: Parameters<CreateDialogFnType>[1],
) {
  const bodyCache = computed(() => {
    return typeof _options.body === 'function' ? _options.body(h) : _options.body
  })
  const options: Parameters<CreateDialogFnType>[0] = {
    closeOnEscKeydown: false,
    closeOnOverlayClick: false,
    closeWhenCloseAll: true,
    destroyOnClose: true,
    draggable: true,
    header: '提示',
    mode: 'modal' as const,
    placement: 'center' as const,
    width: 'fit-content',
    ...(_options ?? {}),
    body: () => bodyCache.value,
  }
  let instance: DialogInstance | undefined
  const obj = {
    ...options,
    onClosed: () => {
      options.onClosed?.()
      dialogs.delete(instance!)
    },
  }

  delete obj.closeWhenCloseAll
  instance = type === undefined ? DialogPlugin(obj, context) : DialogPlugin[type](obj, context)

  if (options.closeWhenCloseAll) {
    dialogs.add(instance)
  }

  return instance
}

const createDialog: CreateDialogType = function (...arg) {
  return create(undefined, ...arg)
} as CreateDialogType

Object.values(DialogCreateType).forEach((type) => {
  if (type === 'closeAll') {
    createDialog[type] = () => {
      dialogs.forEach((dialog) => {
        dialog.hide()
      })
    }
  } else {
    createDialog[type] = (...arg) => {
      return create(type, ...arg)
    }
  }
})

export default createDialog
