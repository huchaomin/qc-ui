import type { LocationQuery, RouteRecordNameGeneric } from 'vue-router'

export interface recentRoutersConfig {
  name: string
  query: LocationQuery
}

export default defineStore(
  'recentRouters',
  () => {
    const recentRouters = ref<recentRoutersConfig[]>([])
    const excludeKPname: string[] = reactive([]) // TODO 不缓存的路由name
    const router = useRouter()

    // 每次进来用户权限可能发生变化，需要重新过滤路由
    function init(): void {
      recentRouters.value = recentRouters.value.filter((item) => {
        return router.hasRoute(item.name)
      })
    }

    function add(fromName: RouteRecordNameGeneric, options: recentRoutersConfig): void {
      const copyOptions = _.cloneDeep(options)
      const index = recentRouters.value.findIndex(item => item.name === copyOptions.name)
      // TODO
      delete copyOptions.query._fromLeftTree
      delete copyOptions.query._fromBreadcrumb
      delete copyOptions.query._refresh

      if (index === -1) {
        const fromIndex = recentRouters.value.findIndex(item => item.name === fromName)

        if (fromIndex === -1) {
          recentRouters.value.push(copyOptions)
        }
        else {
          recentRouters.value.splice(fromIndex + 1, 0, copyOptions)
        }
      }
      else {
        recentRouters.value[index] = copyOptions
      }
    }

    function remove(name: RouteRecordNameGeneric): void {
      const index = recentRouters.value.findIndex(item => item.name === name)

      if (index !== -1) {
        recentRouters.value.splice(index, 1)
      }
    }

    function clear(): void {
      recentRouters.value = []
      excludeKPname.length = 0
    }

    function addExcludeKPname(name: string): void {
      excludeKPname.push(name)
    }

    function removeExcludeKPname(name: string): void {
      const index = excludeKPname.findIndex(item => item === name)

      if (index !== -1) {
        excludeKPname.splice(index, 1)
      }
    }

    return {
      add,
      addExcludeKPname,
      clear,
      excludeKPname,
      init,
      recentRouters,
      remove,
      removeExcludeKPname,
    }
  },
  {
    persist: {
      pick: ['recentRouters'],
    },
  },
)
