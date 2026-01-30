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
  return (h: typeof import('vue').h, context: Parameters<CellRenderFn>[1]) => {
    return h(defineAsyncComponent(compos[`./${config.component}.vue`]!), {
      ...config,
      ...context,
      component: undefined,
    })
  }
}
