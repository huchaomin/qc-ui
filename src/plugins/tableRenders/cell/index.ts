import type { DicLabelProps } from './DicLabel.vue'
import type { LinkProps } from './Link.vue'
import type { CellRenderContext, CellRenderFn } from '@/components/tDesignReset/TTable.vue'

export type CellObjConfig = XOR<DicLabelConfig, LinkConfig>

export const cellRenderContextKeys = ['row', 'col', 'colIndex', 'rowIndex']

type DicLabelConfig = XOR<
  Omit<DicLabelProps, '_component'>,
  {
    _componentProps: (context: CellRenderContext) => Omit<DicLabelProps, '_component'>
  }
> & {
  _component: 'DicLabel'
}
type LinkConfig = XOR<
  Omit<LinkProps, '_component'>,
  {
    _componentProps: (context: CellRenderContext) => Omit<LinkProps, '_component'>
  }
> & {
  _component: 'Link'
}

const compos: Record<string, Component> = import.meta.glob('./*.vue', {
  eager: true,
  import: 'default',
})

export function getCellRender(config: CellObjConfig): CellRenderFn {
  const { _component, ...restConfig } = config

  return (h: typeof import('vue').h, context: Parameters<CellRenderFn>[1]) => {
    return h(compos[`./${_component}.vue`]!, {
      ...(typeof restConfig._componentProps === 'function'
        ? // eslint-disable-next-line ts/no-unsafe-call
          restConfig._componentProps(context as CellRenderContext)
        : restConfig),
      ...context,
    })
  }
}
