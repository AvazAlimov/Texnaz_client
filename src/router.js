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
      component: () => import('./views/Calculator.vue'),
    },
    {
      path: '/batch',
      name: 'batch',
      component: () => import('./views/Batch.vue'),
    },
    // PURPOSES
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
    // UNITS
    {
      path: '/units',
      name: 'units',
      component: () => import('./views/Units.vue'),
    },
    {
      path: '/unit',
      name: 'unit_create',
      component: () => import('./views/Unit.vue'),
    },
    {
      path: '/unit/:id',
      name: 'unit_update',
      component: () => import('./views/Unit.vue'),
    },
    // TAGS
    {
      path: '/tags',
      name: 'tags',
      component: () => import('./views/Tags.vue'),
    },
    {
      path: '/tag',
      name: 'tag_create',
      component: () => import('./views/Tag.vue'),
    },
    {
      path: '/tag/:id',
      name: 'tag_update',
      component: () => import('./views/Tag.vue'),
    },
    // TYPES
    {
      path: '/types',
      name: 'types',
      component: () => import('./views/Types.vue'),
    },
    {
      path: '/type',
      name: 'type_create',
      component: () => import('./views/Type.vue'),
    },
    {
      path: '/type/:id',
      name: 'type_update',
      component: () => import('./views/Type.vue'),
    },
    // PRODUCTS
    {
      path: '/products',
      name: 'products',
      component: () => import('./views/Products.vue'),
    },
    {
      path: '/product',
      name: 'product_create',
      component: () => import('./views/Product.vue'),
    },
    {
      path: '/product/:id',
      name: 'product_update',
      component: () => import('./views/Product.vue'),
    },
    // USERS
    {
      path: '/users',
      name: 'users',
      component: () => import('./views/Users.vue'),
    },
    {
      path: '/user',
      name: 'user_create',
      component: () => import('./views/User.vue'),
    },
    {
      path: '/user/:id',
      name: 'user_update',
      component: () => import('./views/User.vue'),
    },
    // WAREHOUSES
    {
      path: '/warehouses',
      name: 'warehouses',
      component: () => import('./views/Warehouses.vue'),
    },
    {
      path: '/warehouse',
      name: 'warehouse_create',
      component: () => import('./views/Warehouse.vue'),
    },
    {
      path: '/warehouse/:id',
      name: 'warehouse_update',
      component: () => import('./views/Warehouse.vue'),
    },
    // WAREHOUSES
    {
      path: '/suppliers',
      name: 'suppliers',
      component: () => import('./views/Suppliers.vue'),
    },
    {
      path: '/supplier',
      name: 'supplier_create',
      component: () => import('./views/Supplier.vue'),
    },
    {
      path: '/supplier/:id',
      name: 'supplier_update',
      component: () => import('./views/Supplier.vue'),
    },
    // CONFIGURATIONS
    {
      path: '/configurations',
      name: 'configurations',
      component: () => import('./views/Configurations.vue'),
    },
    // EXPANSES
    {
      path: '/expanses',
      name: 'expanses',
      component: () => import('./views/Expanses.vue'),
    },
    {
      path: '/expanse',
      name: 'expanse_create',
      component: () => import('./views/Expanse.vue'),
    },
    {
      path: '/expanse/:id',
      name: 'expanse_update',
      component: () => import('./views/Expanse.vue'),
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
