/**
 * 路由守卫 可选的第三个参数 next，将会被移除
 * hasNecessaryRoute 与 hasRoute
 */

import { createRouter, createWebHistory, isNavigationFailure, NavigationFailureType } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    // {
    //   component: async () => import('@/layout/NotFound.vue'),
    //   meta: {
    //     hidden: true,
    //     title: '404',
    //   },
    //   name: 'NotFound',
    //   path: '/:pathMatch(.*)*',
    // },
  ],
  sensitive: true,
  strict: true,
})
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
