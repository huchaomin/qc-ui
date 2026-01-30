import type { DicLabelProps } from './DicLabel.vue'
import type { CellRenderFn } from '@/components/tDesignReset/TTable.vue'

export type CellObjConfig = DicLabelConfig

interface DicLabelConfig extends DicLabelProps {
  component: 'DicLabel'
}

const compos = import.meta.glob('./*.vue') as Record<
  string,
  () => Promise<{
    default: Component
  }>
>

export function getCellRender(config: CellObjConfig): CellRenderFn {
  const { component, ...restConfig } = config

  return (h: typeof import('vue').h, context: Parameters<CellRenderFn>[1]) => {
    return h(defineAsyncComponent(compos[`./${component}.vue`]!), {
      ...restConfig,
      ...context,
    })
  }
}
