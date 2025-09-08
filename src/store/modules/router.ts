import type { Component } from 'vue'
import type { RouteRecordRaw as _RouteRecordRaw } from 'vue-router'
import { getTopRoute } from '@/router/index'

export interface RouteRecordRaw {
  children?: RouteRecordRaw[]
  component?: Component | LazyRouterImport
  meta: {
    fullScreen: boolean
    hidden: boolean
    icon: string
    noCache: boolean
    parentName: string
    title: string
  }
  name: string
  path: string
  redirect?: {
    name: string
  }
}

type LazyRouterImport = () => Promise<{
  default: Component
}>
interface ResRouterItem
  extends Omit<RouteRecordRaw, 'children' | 'component' | 'meta' | 'redirect'> {
  children?: ResRouterItem[]
  component?: Component | LazyRouterImport | string
  hidden?: boolean
  meta?: {
    fullScreen?: boolean
    hidden?: boolean
    icon: string
    link?: null | string
    noCache: boolean
    title: string
  }
}

export function getRoutersMethod() {
  return alovaInst.Get<ResRouterItem[]>('getRouters', {
    meta: {
      useFailMsg: '获取用户路由失败',
      useLoading: '正在获取用户路由...',
    },
  })
}

function filterRouter(item: RouteRecordRaw): boolean {
  // item.children length 肯定大于0
  return item.children !== undefined || item.component !== undefined
}

// 针对下面面那种最外层新建一个菜单的
// {
//   "path": "/",
//   "hidden": true,
//   "component": "Layout",
//   "children": [
//       {
//           "name": "AssetAnalysis",
//           "path": "assetAnalysis",
//           "hidden": false,
//           "component": "assetAnalysis/index",
//           "meta": {
//               "title": "资产分析",
//               "icon": "#",
//               "noCache": true,
//               "link": null
//           }
//       }
//   ]
// }
function preprocess(arr: ResRouterItem[]): ResRouterItem[] {
  const tmp: ResRouterItem[] = []

  arr.forEach((item) => {
    if (item.path === '/') {
      tmp.push({
        ...item.children![0]!,
        hidden: item.hidden,
      })
    } else {
      tmp.push(item)
    }
  })
  return tmp
}

function process(routers: ResRouterItem[]): RouteRecordRaw[] {
  const fn: (
    arr: ResRouterItem[],
    parent: null | RouteRecordRaw,
  ) => RouteRecordRaw[] = (arr, parent) => {
    const tmpArr: RouteRecordRaw[] = []

    arr.forEach((item) => {
      const newItem: RouteRecordRaw = {
        meta: {
          fullScreen: item.meta?.fullScreen ?? item.meta?.link !== null,
          hidden: item.hidden ?? item.meta?.hidden ?? false,
          icon: item.meta?.icon === '#' ? '' : (item.meta?.icon ?? ''),
          noCache: item.meta?.noCache ?? false,
          parentName: '',
          title: item.meta?.title ?? '',
        },
        name: item.name,
        path:
          item.path.startsWith('/') && parent !== null
            ? item.path.slice(1)
            : item.path,
      }

      if (item.children !== undefined) {
        const result = fn(item.children, newItem)

        if (result.length > 0) {
          newItem.children = result

          const first = result.find((i) => !i.meta.hidden)

          if (first !== undefined) {
            newItem.redirect = { name: first.name }
          }
        }
      }

      if (
        item.component !== undefined &&
        !['Layout', 'ParentView'].includes(item.component as string)
      ) {
        newItem.component = setRouterComponent(item)
      }

      if (parent !== null) {
        newItem.meta.parentName = parent.name
      }

      if (filterRouter(newItem)) {
        tmpArr.push(newItem)
      }
    })
    return tmpArr
  }
  const p = getTopRoute() as ResRouterItem

  p.children!.push(...routers)
  return fn([p], null)
}

function raiseHiddenRoutes(routers: RouteRecordRaw[]): RouteRecordRaw[] {
  const fn: (parentChildren: RouteRecordRaw[]) => RouteRecordRaw[] = (
    parentChildren,
  ) => {
    const arr = [...parentChildren]
    const length = arr.length

    for (let i = length - 1; i >= 0; i--) {
      const current = arr[i]!

      if (current.children !== undefined) {
        // 说明current是一个菜单，而不是一个目录，里面所有的隐藏菜单都必须与父菜单平级
        if (current.redirect === undefined) {
          current.children.forEach((item) => {
            arr.splice(i + 1, 0, ...fn([item]))
          })
          delete current.children
        } else {
          current.children = fn(current.children)
        }
      }
    }

    return arr
  }

  return fn(routers)
}

// 只能是以index.vue结尾的文件
const modules = import.meta.glob('@/views/**/index.vue') as Record<
  string,
  LazyRouterImport
>

function setRouterComponent(item: ResRouterItem): RouteRecordRaw['component'] {
  if (
    typeof item.component === 'function' ||
    typeof item.component === 'string'
  ) {
    const component = item.component as LazyRouterImport | string
    const fn: LazyRouterImport | undefined =
      typeof component === 'string'
        ? modules[`/src/views/${component}.vue`]
        : component

    if (fn === undefined) {
      // void $notify.error(`路由组件/src/views/${component as string}.vue不存在`) TODO
      console.error(`路由组件/src/views/${component as string}.vue不存在`)
      return () => import('@/layout/NotFound.vue')
    }

    return () =>
      fn().then((comp) => {
        return {
          ...comp.default,
          name: item.name,
        } as Component
      })
  } else {
    return item.component // layout/Index
  }
}

export default defineStore('router', () => {
  const routersRaw: Ref<RouteRecordRaw[]> = ref([])
  const router = useRouter()

  async function getRouters() {
    const res = await getRoutersMethod()

    routersRaw.value = markRaw(raiseHiddenRoutes(process(preprocess(res))))

    if (router.hasRoute('Index')) {
      router.removeRoute('Index')
    }

    routersRaw.value.forEach((item) => {
      router.addRoute(item as _RouteRecordRaw)
    })
    useRecentRoutersStore().init()
  }

  function clear() {
    routersRaw.value.forEach((item) => {
      router.removeRoute(item.name)
    })
    routersRaw.value = []
  }

  return {
    clear,
    getRouters,
    routersRaw,
  }
})
