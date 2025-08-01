/**
 * 路由守卫 可选的第三个参数 next，将会被移除
 * hasNecessaryRoute 与 hasRoute
 */
import type { ResRouterItem } from '@/store/modules/router'
import type { RouteRecordSingleView , RouteRecordSingleViewWithChildren } from 'vue-router'
import { createRouter, createWebHistory, isNavigationFailure, NavigationFailureType } from 'vue-router'
import Index from '@/layout/Index.vue'

export function getTopRoute(): ResRouterItem {
  return {
    children: [
      {
        children: [
          {
            component: () => import('@/layout/profile/Index.vue'),
            meta: {
              hidden: true,
              title: '个人中心',
            },
            name: 'Profile',
            path: 'profile',
          },
        ],
        component: () => import('@/layout/Home.vue'),
        meta: { title: '首页' },
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
    getTopRoute() as RouteRecordSingleView | RouteRecordSingleViewWithChildren,
    {
      component: () => import('@/layout/Login.vue'),
      meta: {
        hidden: true,
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
        hidden: true,
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
// router.beforeEach(async (to) => {
//   if (to.name === 'Login') {
//     return
//   }

//   const userStore = useUserStore()

//   if (userStore.token === '') {
//     return ({ name: 'Login' })
//   }
//   else {

//   }
// })

router.afterEach((to, from, failure) => {
  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    void $msg.info('导航被中断')
  }
  else if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
    void $msg.info('导航被取消，因为有一个新的导航')
  }
  else if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
    void $msg.info('导航被阻止，因为我们已经在目标位置了')
  }
})

export default router
