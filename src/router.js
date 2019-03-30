import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/',
      meta: { requiresAuth: true },
      component: () => import('./views/Home.vue'),
      children: [
        {
          path: '/calculator',
          name: 'calculator',
          component: () => import('./views/Calculator.vue'),
        },

        {
          path: '/settings',
          component: () => import('./views/Settings.vue'),
          children: [
          // DATABASE
            {
              path: '',
              name: 'settings',
              component: () => import('./views/settings/Database.vue'),
            },

            // BRANDS
            {
              path: 'brands',
              name: 'brands',
              component: () => import('./views/settings/Brands.vue'),
            },
            {
              path: 'brand',
              name: 'brand',
              component: () => import('./views/settings/Brand.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/Brand.vue'),
                },
              ],
            },

            // PRODUCT TYPES
            {
              path: 'product_types',
              name: 'product_types',
              component: () => import('./views/settings/ProductTypes.vue'),
            },
            {
              path: 'product_type',
              name: 'product_type',
              component: () => import('./views/settings/ProductType.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/ProductType.vue'),
                },
              ],
            },

            // UNITS
            {
              path: 'units',
              name: 'units',
              component: () => import('./views/settings/Units.vue'),
            },
            {
              path: 'unit',
              name: 'unit',
              component: () => import('./views/settings/Unit.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/Unit.vue'),
                },
              ],
            },

            // PURPOSES
            {
              path: 'purposes',
              name: 'purposes',
              component: () => import('./views/settings/Purposes.vue'),
            },
            {
              path: 'purpose',
              name: 'purpose',
              component: () => import('./views/settings/Purpose.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/Purpose.vue'),
                },
              ],
            },

            // TAGS
            {
              path: 'tags',
              name: 'tags',
              component: () => import('./views/settings/Tags.vue'),
            },
            {
              path: 'tag',
              name: 'tag',
              component: () => import('./views/settings/Tag.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/Tag.vue'),
                },
              ],
            },

            // PRODUCTS
            {
              path: 'products',
              name: 'products',
              component: () => import('./views/settings/Products.vue'),
            },
            {
              path: 'product',
              name: 'product',
              component: () => import('./views/settings/Product.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/Product.vue'),
                },
              ],
            },

            // USERS
            {
              path: 'users',
              name: 'users',
              component: () => import('./views/settings/Users.vue'),
            },
            {
              path: '/user',
              name: 'user',
              component: () => import('./views/settings/User.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/User.vue'),
                },
              ],
            },

            // EXPANSES
            {
              path: 'expanses',
              name: 'expanses',
              component: () => import('./views/settings/Expanses.vue'),
            },
            {
              path: 'expanse',
              name: 'expanse',
              component: () => import('./views/settings/Expanse.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/Expanse.vue'),
                },
              ],
            },

            // CONFIGURATIONS
            {
              path: 'configurations',
              name: 'configurations',
              component: () => import('./views/settings/Configurations.vue'),
            },

            // WAREHOUSES
            {
              path: 'warehouses',
              name: 'settings_warehouses',
              component: () => import('./views/settings/Warehouses.vue'),
            },
            {
              path: 'warehouse',
              name: 'settings_warehouse',
              component: () => import('./views/settings/Warehouse.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/Warehouse.vue'),
                },
              ],
            },
          ],
        },

        {
          path: '/batch',
          name: 'batch',
          component: () => import('./views/Batch.vue'),
        },

        {
          path: '/warehouses',
          name: 'warehouses',
          component: () => import('./views/Warehouses.vue'),
        },
      ],
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
