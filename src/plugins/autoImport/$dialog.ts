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

const index = ref(0)
const dialogs = new Set<DialogInstance>()

/**
 * @description: cancel、escKeydown、closeBtnClick、overlayClick 如果允许弹窗关闭的话，最后都会触发 close 事件
 */
function create(
  type: `${Exclude<DialogCreateType, 'closeAll'>}` | undefined,
  _options: Parameters<CreateDialogFnType>[0],
  context: Parameters<CreateDialogFnType>[1],
) {
  const el = ref<HTMLDivElement | null>(null)
  const bodyCache = computed(() => {
    return typeof _options.body === 'function' ? _options.body(h) : _options.body
  })
  const options = {
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
  const isCustomDragEnabled = options.draggable === true && options.mode === 'modal'
  const id = `${isCustomDragEnabled ? 'drag' : 'normal'}-dialog-${++index.value}`
  let instance: DialogInstance | undefined
  const obj = {
    ...options,
    id,
    onClosed: () => {
      options.onClosed?.()
      el.value = null
      dialogs.delete(instance!)
    },
    onOpened: () => {
      options.onOpened?.()
      el.value = document.getElementById(id) as HTMLDivElement

      const targetRef: Ref<HTMLElement | null> = computed(
        () => el.value?.querySelector('.t-dialog') ?? null,
      )
      const containerRef: Ref<HTMLElement | null> = computed(
        () => el.value?.querySelector('.t-dialog__position') ?? null,
      )
      const bodyRef: Ref<HTMLElement | null> = computed(
        () => el.value?.querySelector('[class^="t-dialog__body"]') ?? null,
      )
      const footerRef: Ref<HTMLElement | null> = computed(
        () => el.value?.querySelector('.t-dialog__footer') ?? null,
      )
      const { height: containerHeight, width: containerWidth } = useElementSize(
        containerRef,
        undefined,
        {
          box: 'border-box',
        },
      )
      const { height: targetHeight, width: targetWidth } = useElementSize(targetRef, undefined, {
        box: 'border-box',
      })
      const gap = 10
      const maxX = computed(() => containerWidth.value - targetWidth.value - gap)
      const maxY = computed(() => containerHeight.value - targetHeight.value - gap)

      useDraggable(targetRef, {
        disabled: !isCustomDragEnabled,
        onMove(_position) {
          const position = {
            x: Math.max(gap, Math.min(maxX.value, _position.x)),
            y: Math.max(gap, Math.min(maxY.value, _position.y)),
          }

          if (targetRef.value !== null) {
            targetRef.value.style.transform = `translate(${position.x - targetRef.value.offsetLeft}px, ${position.y - targetRef.value.offsetTop}px)`
          }
        },
        onStart(_, event) {
          // body 和 footer 不能拖动
          if (
            (bodyRef.value !== null && bodyRef.value.contains(event.target as Node)) ||
            (footerRef.value !== null && footerRef.value.contains(event.target as Node))
          ) {
            return false
          }

          document.body.dispatchEvent(new Event('mousedown')) // 关闭popup
        },
        // exact: true, // 必须为target,不能为其子元素
        preventDefault: true,
        stopPropagation: true,
      })
    },
  }

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
