import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    meta: {
      requiresAuth: true,
    },
    component: () => import('./views/Home.vue'),
    children: [{
      path: '/',
      name: 'database',
      component: () => import('./views/Database.vue'),
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: () => import('./views/Database.vue'),
    },
    {
      path: '/purposes',
      name: 'purposes',
      component: () => import('./views/Purposes.vue'),
    },
    {
      path: '/purpose',
      name: 'purpose_create',
      component: () => import('./views/Purpose.vue'),
    },
    {
      path: '/purpose/:id',
      name: 'purpose_update',
      component: () => import('./views/Purpose.vue'),
    },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue'),
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      requiresAuth: true,
    },
    beforeEnter(to, from, next) {
      store.commit('logout');
      next({
        name: 'login',
      });
    },
  },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.token;
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (isAuthenticated) {
      next();
    } else {
      const path = to.name !== 'logout' ? to.path : '/';
      next({
        name: 'login',
        query: {
          redirectTo: path,
        },
      });
    }
  } else if (to.matched.some(route => route.meta.requiresGuest)) {
    if (!isAuthenticated) {
      next();
    } else {
      next({
        name: 'home',
      });
    }
  } else {
    next();
  }
});

export default router;
