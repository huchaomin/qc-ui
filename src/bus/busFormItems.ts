import type { AsyncComponentLoader } from 'vue'
import type { AuthorNameProps } from '@/bus/components/AuthorName.vue'
import type { CronProps } from '@/plugins/cron/Index.vue'

export interface busComponentPropsMap {
  AuthorName: AuthorNameProps
  Cron: Omit<CronProps, 'modelValue'>
}
export default new Map<string, AsyncComponentLoader>([
  ['AuthorName', () => import('@/bus/components/AuthorName.vue')],
  ['Cron', () => import('@/plugins/cron/Index.vue')],
])
