import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  routes: [
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
      beforeEnter(_, __, next) {
        store.commit('logout');
        next({
          name: 'login',
        });
      },
    },
    {
      path: '/',
      meta: { requiresAuth: true },
      component: () => import('./views/Home.vue'),
      children: [
        {
          path: 'calculator',
          name: 'calculator',
          component: () => import('./views/calculator/Calculator.vue'),
          children: [
            {
              path: ':id',
              name: 'batch',
              redirect: ':id/batch_info',
              component: () => import('./views/calculator/Batch.vue'),
              children: [
                {
                  path: 'batch_info',
                  name: 'batch_info',
                  component: () => import('./views/calculator/BatchInfo.vue'),
                },
                {
                  path: 'selection',
                  name: 'selection',
                  component: () => import('./views/calculator/Selection.vue'),
                },
                {
                  path: 'customs_expanses',
                  name: 'customs_expanses',
                  component: () => import('./views/calculator/CustomsExpanses.vue'),
                },
                {
                  path: 'first_cost',
                  name: 'first_cost',
                  component: () => import('./views/calculator/FirstCost.vue'),
                },
                {
                  path: 'second_cost',
                  name: 'second_cost',
                  component: () => import('./views/calculator/SecondCost.vue'),
                },
                {
                  path: 'price',
                  name: 'price',
                  component: () => import('./views/calculator/Price.vue'),
                },
              ],
            },
          ],
        },
        {
          path: 'managers',
          name: 'managers',
          component: () => import('./views/managers/Managers.vue'),
          children: [
            {
              path: ':id',
              name: 'manager',
              component: () => import('./views/managers/Manager.vue'),
            },
            {
              path: 'template',
              name: 'template_manager',
              component: () => import('./views/managers/Template.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/managers/Template.vue'),
                },
              ],
            },
          ],
        },
        {
          path: 'clients',
          name: 'clients',
          component: () => import('./views/clients/Clients.vue'),
          children: [
            {
              path: 'client',
              name: 'client',
              component: () => import('./views/clients/Client.vue'),
              children: [{
                path: ':id',
                component: () => import('./views/clients/Client.vue'),
              }],
            },
          ],
        },
        {
          path: 'prices',
          name: 'prices',
          component: () => import('./views/prices/Prices.vue'),
          children: [
            {
              path: 'priced',
              name: 'priced',
              component: () => import('./views/prices/PricedProducts.vue'),
            },
            {
              path: 'unpriced',
              name: 'unpriced',
              component: () => import('./views/prices/UnpricedProducts.vue'),
            },
          ],
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('./views/settings/Settings.vue'),
          children: [
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

            // EXPANSES
            {
              path: 'regions',
              name: 'regions',
              component: () => import('./views/settings/Regions.vue'),
            },
            {
              path: 'region',
              name: 'region',
              component: () => import('./views/settings/Region.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/settings/Region.vue'),
                },
              ],
            },

            // CONFIGURATIONS
            {
              path: 'configurations',
              name: 'configurations',
              component: () => import('./views/settings/Configurations.vue'),
            },

            // THEMES
            {
              path: 'themes',
              name: 'themes',
              component: () => import('./views/settings/Themes.vue'),
            },
          ],
        },

        {
          path: 'warehouses',
          name: 'warehouses',
          component: () => import('./views/warehouses/Warehouses.vue'),
          children: [
            {
              path: ':id',
              name: 'warehouse',
              redirect: ':id/information',
              component: () => import('./views/warehouses/Warehouse.vue'),
              children: [
                {
                  path: 'information',
                  name: 'information',
                  component: () => import('./views/warehouses/Information.vue'),
                },
                {
                  path: 'stock',
                  name: 'stock',
                  component: () => import('./views/warehouses/Stock.vue'),
                },
              ],
            },
            {
              path: 'template',
              name: 'template_warehouse',
              component: () => import('./views/warehouses/Template.vue'),
              children: [
                {
                  path: ':id',
                  component: () => import('./views/warehouses/Template.vue'),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

router.beforeEach((to, _, next) => {
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
