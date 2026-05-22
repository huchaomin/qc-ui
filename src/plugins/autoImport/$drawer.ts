import type { DrawerOptions } from 'tdesign-vue-next'
import type { AppContext } from 'vue'

type Options = Omit<DrawerOptions, 'default' | 'onConfirm'> & {
  onConfirm?:
    | ((...args: Parameters<NonNullable<DrawerOptions['onConfirm']>>) => Promise<void>)
    | DrawerOptions['onConfirm']
}

export default function create(_options: Options, context: AppContext) {
  const bodyCache = computed(() => {
    return typeof _options.body === 'function' ? _options.body(h) : _options.body
  })
  const options: Options = {
    closeOnEscKeydown: false,
    closeOnOverlayClick: false,
    destroyOnClose: true,
    header: false,
    lazy: true,
    size: 'medium',
    sizeDraggable: true,
    ...(_options ?? {}),
    body: () => bodyCache.value,
  }

  return DrawerPlugin(options, context)
}
