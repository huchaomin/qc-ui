import type { SlotReturnValue } from 'tdesign-vue-next'
import type { DefaultProps } from './Default.vue'
import type {
  TableCol,
  TitleRenderContext,
  TitleTNodeFn,
} from '@/components/tDesignReset/TTable.vue'
import Wrapper from '../Wrapper.vue'

export type TitleConfigFn = (
  h: typeof import('vue').h,
  context: TitleRenderContext,
) => SlotReturnValue | TitleConfigObj
export type TitleConfigObj = UnionToNestedXOR<
  keyof ComponentPropsMap extends infer T
    ? T extends keyof ComponentPropsMap
      ? ComponentConfig<T>
      : never
    : never
>

type ComponentConfig<T extends keyof ComponentPropsMap> = ComponentPropsMap[T] & {
  _component: T
}
interface ComponentPropsMap {
  Default: DefaultProps
}

const compos: Record<string, Component> = import.meta.glob('./*.vue', {
  eager: true,
  import: 'default',
})

export function getTitleRender(_config: TableCol['title']): TitleTNodeFn {
  // eslint-disable-next-line ts/no-unsafe-assignment
  const config =
    _config === undefined
      ? { _component: 'Default' }
      : typeof _config === 'string'
        ? { _component: 'Default', default: _config }
        : _config

  if (isTitleObjConfig(config)) {
    // eslint-disable-next-line ts/no-unsafe-assignment
    const { _component, ...restConfig } = config

    return (h: typeof import('vue').h, context: Parameters<TitleTNodeFn>[1]) => {
      return h(Wrapper, context, () => {
        return h(compos[`./${_component}.vue`], {
          ...restConfig,
          ...context,
        })
      })
    }
  }

  return (h: typeof import('vue').h, context: Parameters<TitleTNodeFn>[1]) => {
    // @ts-expect-error 类型断言不准确
    // eslint-disable-next-line ts/no-unsafe-assignment
    const result = config(h, context)

    if (isTitleObjConfig(result)) {
      // eslint-disable-next-line ts/no-unsafe-assignment
      const { _component, ...restConfig } = result

      return h(Wrapper, context, () => {
        return h(compos[`./${_component}.vue`], {
          ...restConfig,
          ...context,
        })
      })
    } else {
      return h(Wrapper, context, () => result)
    }
  }
}

function isTitleObjConfig(value: any): value is TitleConfigObj {
  // eslint-disable-next-line ts/no-unsafe-member-access
  return value?._component !== undefined
}
