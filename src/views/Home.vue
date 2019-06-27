<template lang="pug">
  v-app
    v-navigation-drawer(app v-model="drawer")
      v-toolbar.primary(flat).toolbar__border
        v-list.pa-0
          v-list-tile(avatar)
            v-list-tile-avatar
              img(:src="require('../assets/logo.svg')")
            v-list-tile-content
              v-list-tile-title.font-weight-bold DIGMAN
      v-list.pt-0(two-line)
        template(v-for="(item, index) in items")
          v-divider(v-if="item.divider").divider
          v-list-tile(
            :to="item.to"
            active-class="bordered"
            :class="item.path === $route.path ? 'bordered' : ''"
            v-if="item.permission ? $hasPermission(item.permission) : true"
          )
            v-list-tile-action
              v-icon(color="secondary") {{item.icon}}
            v-list-tile-content
              v-list-tile-title {{ item.title }}
    v-toolbar.elevation-0.toolbar__border(app color="primary")
      v-toolbar-side-icon(@click.stop="drawer = !drawer")
      v-toolbar-title {{ user.name }}
    v-content
      v-container(grid-list-md fluid)
        router-view
</template>

<script>
import { AXIOS } from '../services/Api';
import Auth from '../services/Auth';

export default {
  name: 'Home',
  data() {
    return {
      drawer: false,
      user: {},
      items: [
        {
          icon: 'data_usage',
          title: 'Мониторинг',
          to: '/',
          permission: this.$permissions.SHOW_STATISTICS.name,
        },
        {
          icon: 'table_chart',
          title: 'Таблицы',
          to: '/tables',
        },
        {
          icon: 'money',
          title: 'Ценообразование',
          to: '/calculator',
          permission: this.$permissions.SHOW_CALCULATOR.name,
        },
        {
          icon: 'list',
          title: 'Цены',
          to: '/prices',
          permission: this.$permissions.SHOW_PRICES.name,
        },
        {
          icon: 'store_mall_directory',
          title: 'Склады',
          to: '/warehouses',
          permission: this.$permissions.SHOW_WAREHOUSES.name,
        },
        {
          icon: 'how_to_reg',
          title: 'Менеджеры',
          to: '/managers',
          permission: this.$permissions.SHOW_MANAGERS.name,
        },
        {
          icon: 'timeline',
          title: 'Мотивация',
          to: '/motivations',
          // permission: this.$permissions.SHOW_MANAGERS.name,
        },
        {
          icon: 'perm_identity',
          title: 'Клиенты',
          to: '/clients',
          permission: this.$permissions.SHOW_CLIENTS.name,
        },
        {
          icon: 'local_shipping',
          title: 'Отгрузки',
          to: '/shipments',
          permission: this.$permissions.SHOW_SHIPMENTS.name,
        },
        {
          icon: 'payment',
          title: 'Оплаты',
          to: '/payments',
          permission: this.$permissions.SHOW_PAYMENTS.name,
        },
        {
          icon: 'import_contacts',
          title: 'Мои расходы',
          to: { name: 'myexpanses' },
          permission: this.$permissions.SHOW_MY_EXPANSES.name,
        },
        {
          icon: 'settings',
          title: 'Настройки',
          to: { name: 'settings' },
          permission: this.$permissions.SHOW_SETTINGS.name,
        },
        {
          divider: true,
          icon: 'exit_to_app',
          title: 'Выйти',
          to: '/logout',
        },
      ],
    };
  },
  mounted() {
    AXIOS.interceptors.response.use(undefined, (error) => {
      if (error.response && error.response.status === 401) { this.$router.push('/logout'); }
    });
    Auth.details().then((user) => {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    });
  },
};
</script>
<style scoped>
.toolbar__border {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.v-list-tile-height {
    min-height: 120px;
}
</style>
