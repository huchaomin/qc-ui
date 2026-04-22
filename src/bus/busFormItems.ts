import type { AsyncComponentLoader } from 'vue'
import type { CronProps } from '@/plugins/cron/Index.vue'

export interface busComponentPropsMap {
  Cron: Omit<CronProps, 'modelValue'>
}
export default new Map<string, AsyncComponentLoader>([
  ['AuthorName', () => import('@/bus/components/AuthorName.vue')],
  ['Cron', () => import('@/plugins/cron/Index.vue')],
])
