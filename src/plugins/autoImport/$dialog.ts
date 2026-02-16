import type { DialogInstance, DialogOptions } from 'tdesign-vue-next'
import type { AppContext } from 'vue'

enum DialogCreateType {
  alert = 'alert',
  confirm = 'confirm',
}

export type CreateDialogFnType = (
  options: Omit<DialogOptions, 'default' | 'onConfirm'> & {
    onConfirm?:
      | ((...args: Parameters<NonNullable<DialogOptions['onConfirm']>>) => Promise<void>)
      | DialogOptions['onConfirm']
  },
  context?: AppContext,
) => DialogInstance

type CreateDialogType = CreateDialogFnType & {
  [value in DialogCreateType]: CreateDialogFnType
}

const index = ref(0)

/**
 * @description: cancel、escKeydown、closeBtnClick、overlayClick 如果允许弹窗关闭的话，最后都会触发 close 事件
 */
function create(
  type: `${DialogCreateType}` | undefined,
  _options: Parameters<CreateDialogFnType>[0],
  context: Parameters<CreateDialogFnType>[1],
) {
  const el = ref<HTMLDivElement | null>(null)
  const options = {
    closeOnEscKeydown: false,
    closeOnOverlayClick: false,
    destroyOnClose: true,
    draggable: true,
    header: '提示',
    mode: 'modal' as const,
    placement: 'center' as const,
    width: 'fit-content',
    ...(_options ?? {}),
  }
  const isCustomDragEnabled = options.draggable === true && options.mode === 'modal'
  const id = `${isCustomDragEnabled ? 'drag' : 'normal'}-dialog-${++index.value}`
  const obj = {
    ...options,
    id,
    onClosed: () => {
      options.onClosed?.()
      el.value = null
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
