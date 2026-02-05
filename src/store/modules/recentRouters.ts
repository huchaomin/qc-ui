import type { LocationQuery, RouteRecordNameGeneric } from 'vue-router'
import { getRoute } from '@/router/index'

export interface recentRoutersConfig {
  name: string
  query: LocationQuery
}

export default defineStore(
  'recentRouters',
  () => {
    const recentRouters = ref<recentRoutersConfig[]>([])
    const route = useRoute()
    const router = useRouter()

    // 每次进来用户权限可能发生变化，需要重新过滤路由
    function init(): void {
      recentRouters.value = recentRouters.value.filter((item) => {
        return router.hasRoute(item.name)
      })
    }

    function add(fromName: RouteRecordNameGeneric, options: recentRoutersConfig): void {
      const copyOptions = _cloneDeep(options)
      const index = recentRouters.value.findIndex(
        (item) =>
          item.name === copyOptions.name ||
          // 相同名称的也视为相同的路由
          getRoute(item.name)!.meta.title === getRoute(copyOptions.name)!.meta.title,
      )

      delete copyOptions.query._fromLeftTree
      delete copyOptions.query._fromBreadcrumb

      if (index === -1) {
        const fromIndex = recentRouters.value.findIndex((item) => item.name === fromName)

        if (fromIndex === -1) {
          recentRouters.value.push(copyOptions)
        } else {
          recentRouters.value.splice(fromIndex + 1, 0, copyOptions)
        }
      } else {
        recentRouters.value[index] = copyOptions
      }
    }

    function remove(name: RouteRecordNameGeneric): void {
      const index = recentRouters.value.findIndex((item) => item.name === name)

      if (index !== -1) {
        recentRouters.value.splice(index, 1)
      }
    }

    function close(name: RouteRecordNameGeneric): void {
      if (route.name === name) {
        const currentIndex = recentRouters.value.findIndex((item) => item.name === name)
        const pre = recentRouters.value[currentIndex - 1]

        if (pre !== undefined) {
          void router.push(pre)
        } else {
          void router.push(recentRouters.value[currentIndex + 1]!)
        }
      }

      remove(name)
    }

    function clear(): void {
      recentRouters.value = []
    }

    return {
      add,
      clear,
      close,
      init,
      recentRouters,
      remove,
    }
  },
  {
    persist: {
      pick: ['recentRouters'],
    },
  },
)
