import type { DrawerCloseContext, DrawerInstance, DrawerOptions } from 'tdesign-vue-next'
import type { AppContext } from 'vue'

enum DrawerCreateType {
  closeAll = 'closeAll',
}

export type CreateDrawerFnType = (
  options: {
    /**
     * @description: 关闭所有的时候是不是也关闭这个
     */
    closeWhenCloseAll?: boolean
  } & Omit<DrawerOptions, 'default' | 'onConfirm'> & {
      onConfirm?:
        | ((...args: Parameters<NonNullable<DrawerOptions['onConfirm']>>) => Promise<void>)
        | DrawerOptions['onConfirm']
    },
  context?: AppContext,
) => DrawerInstance

type CreateDrawerType = CreateDrawerFnType & {
  closeAll: () => void
}

const drawers = new Set<DrawerInstance>()

function create(
  _options: Parameters<CreateDrawerFnType>[0],
  context: Parameters<CreateDrawerFnType>[1],
) {
  const bodyCache = computed(() => {
    return typeof _options.body === 'function' ? _options.body(h) : _options.body
  })
  const options: Parameters<CreateDrawerFnType>[0] = {
    attach: '#app', // 不能放到 body 上，push 模式会干扰其他弹窗
    closeOnEscKeydown: false,
    closeOnOverlayClick: false,
    closeWhenCloseAll: true,
    destroyOnClose: true,
    header: false,
    lazy: true,
    sizeDraggable: true,
    ...(_options ?? {}),
    body: () => bodyCache.value,
  }
  let instance: DrawerInstance | undefined
  const obj = {
    ...options,
    onClose: (context: DrawerCloseContext) => {
      options.onClose?.(context)
      drawers.delete(instance!)
    },
  }

  delete obj.closeWhenCloseAll
  instance = DrawerPlugin(obj, context ?? useAppContext())

  if (options.closeWhenCloseAll) {
    drawers.add(instance)
  }

  return instance
}

const createDrawer: CreateDrawerType = function (...arg) {
  return create(...arg)
} as CreateDrawerType

Object.values(DrawerCreateType).forEach((type) => {
  createDrawer[type] = () => {
    drawers.forEach((drawer) => {
      drawer.hide?.()
    })
  }
})

export default createDrawer
