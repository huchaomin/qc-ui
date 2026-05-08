import type { AsyncComponentLoader } from 'vue'
import type { AuthorNameProps } from '@/bus/components/AuthorName.vue'
import type { CronProps } from '@/plugins/formItems/cron/Index.vue'
import type { SelectSysUserProps } from '@/plugins/formItems/selectSysUser/Index.vue'

export interface busComponentPropsMap {
  AuthorName: AuthorNameProps
  Cron: Omit<CronProps, 'modelValue'>
  SelectSysUser: Omit<SelectSysUserProps, 'modelValue'>
}
export const busComponentInitialValueMap = new Map<string, any>([
  ['AuthorName', () => ''],
  ['Cron', () => ''],
  ['SelectSysUser', () => []],
])
export default new Map<string, AsyncComponentLoader>([
  ['AuthorName', () => import('@/bus/components/AuthorName.vue')],
  ['Cron', () => import('@/plugins/formItems/cron/Index.vue')],
  ['SelectSysUser', () => import('@/plugins/formItems/selectSysUser/Index.vue')],
])
