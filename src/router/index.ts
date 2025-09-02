/**
 * 路由守卫 可选的第三个参数 next，将会被移除
 * hasNecessaryRoute 与 hasRoute
 */
import type {
  RouteRecordSingleView,
  RouteRecordSingleViewWithChildren,
} from 'vue-router'
import {
  createRouter,
  createWebHistory,
  isNavigationFailure,
  NavigationFailureType,
} from 'vue-router'
import Index from '@/layout/Index.vue'

export function getTopRoute():
  | RouteRecordSingleView
  | RouteRecordSingleViewWithChildren {
  return {
    children: [
      {
        children: [
          {
            component: () => import('@/layout/profile/Index.vue'),
            meta: {
              fullScreen: false,
              hidden: true,
              icon: '',
              noCache: false,
              parentName: '',
              title: '个人中心',
            },
            name: 'Profile',
            path: 'profile',
          },
        ],
        component: () => import('@/layout/Home.vue'),
        meta: {
          fullScreen: false,
          hidden: false,
          icon: 'tabler:home',
          noCache: false,
          parentName: '',
          title: '首页',
        },
        name: 'Home',
        path: 'home',
      },
    ],
    component: Index,
    name: 'Index',
    path: '/',
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    getTopRoute(),
    {
      component: () => import('@/layout/Login.vue'),
      meta: {
        fullScreen: false,
        hidden: true,
        icon: '',
        noCache: false,
        parentName: '',
        title: '登录',
      },
      name: 'Login',
      path: '/login',
    },
    {
      component: () => import('@/layout/NotFound.vue'),
      meta: {
        fullScreen: false,
        hidden: true,
        icon: '',
        noCache: false,
        parentName: '',
        title: '404',
      },
      name: 'NotFound',
      path: '/:pathMatch(.*)*',
    },
  ],
  sensitive: true,
  strict: true,
})
router.beforeEach(async (to) => {
  if (to.name === 'Login') {
    return
  }

  if (useLoginStore().token === '') {
    return { name: 'Login' }
  } else {
    if (useRouterStore().routersRaw.length > 0) {
      return
    }

    await useUserStore().getUserInfo()
    return router.resolve({
      path: to.path,
      query: to.query,
    })
  }
})
router.afterEach((to, from, failure) => {
  const { meta, name } = to as RouteRecordRaw
  const { fullScreen, parentName, title } = meta

  if (title !== '') {
    document.title = title
  }

  if (!['Login', 'NotFound'].includes(name) && !fullScreen) {
    const recentRoutersStore = useRecentRoutersStore()

    // 如果从面包屑进入，则删除当前下一层级路由
    if (to.query._fromBreadcrumb === 'true') {
      recentRoutersStore.remove(from.name)
    }

    const fromName =
      parentName === from.name || to.query._fromLeftTree !== 'true'
        ? from.name
        : undefined
    recentRoutersStore.add(fromName, {
      name,
      query: to.query,
    })
    // 从不缓存列表中移除
    useExcludeKPnameStore().remove(name)
  }

  if (import.meta.env.DEV) {
    if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      void $msg.info('导航被中断')
    } else if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
      void $msg.info('导航被取消，因为有一个新的导航')
    } else if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
      void $msg.info('导航被阻止，因为我们已经在目标位置了')
    }
  }
})

function getRoute(name: string) {
  if (router.hasRoute(name)) {
    return router.getRoutes().find((route) => route.name === name)
  }
}

export { getRoute }

export default router
