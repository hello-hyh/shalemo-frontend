import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index.vue'),
      children: [
        {
          path: '/',
          name: 'bid',
          component: () => import('../views/bid/index.vue'),
        },
        {
          path: '/bid/biding',
          name: 'biding',
          component: () => import('../views/bid/biding.vue'),
        },

        {
          path: '/contract/list',
          name: 'contractList',
          component: () => import('../views/dev/index.vue'),
        },
        {
          path: '/contract/sign',
          name: 'contractSign',
          component: () => import('../views/dev/index.vue'),
        },
        {
          path: '/supplier/list',
          name: 'supplierList',
          component: () => import('../views/dev/index.vue'),
        },
        {
          path: '/supplier/assess',
          name: 'supplierAssess',
          component: () => import('../views/dev/index.vue'),
        },
        {
          path: '/settings/general',
          name: 'settingsGeneral',
          component: () => import('../views/dev/index.vue'),
        },
        {
          path: '/settings/permission',
          name: 'settingsPermission',
          component: () => import('../views/dev/index.vue'),
        },
      ],
    },
  ],
})
