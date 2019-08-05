<template lang="pug">
  v-app
    v-navigation-drawer(app v-model="drawer")
      v-toolbar.primary(flat).toolbar__border
        v-list.pa-0
          v-list-tile(avatar)
            v-list-tile-avatar
              img(:src="require('../assets/logo.svg')")
            v-list-tile-content
              v-list-tile-title.font-weight-bold.tertiary--text TEXNAZ
      v-list.pt-0(two-line)
        template(v-for="(item, index) in items")
          v-divider(v-if="item.divider").divider
          v-list-tile(
            :to="item.to"
            active-class="bordered tertiary--text"
            :class="item.path === $route.path ? 'bordered' : ''"
            v-if="item.permission ? $hasPermission(item.permission) : true"
          )
            v-list-tile-action
              v-icon {{item.icon}}
            v-list-tile-content
              v-list-tile-title {{ item.title }}
    v-toolbar.elevation-0.toolbar__border(app color="primary")
      v-toolbar-side-icon.tertiary--text(@click.stop="drawer = !drawer")
      v-toolbar-title.tertiary--text {{ user.name }}
      v-spacer
      v-menu(offset-y :close-on-content-click="false" v-if="$hasRole(1)")
        template(v-slot:activator="{ on }")
          v-btn(flat icon v-on="on").dashboardTertiary--text
            v-icon settings
        v-list
          v-list-tile(v-for="(item, index) in configurations" :key="index")
            v-list-tile-title {{ item.name }}
            v-list-tile-content
              v-text-field.my-2(v-model="item.value" color="secondary")
            v-list-tile-action
              v-btn(flat icon @click="update(item.id, item.value)")
                v-icon save
    v-content.dashboardPrimary
      v-container(grid-list-md fluid)
        router-view
</template>

<script>
import { AXIOS } from '../services/Api';
import Auth from '../services/Auth';
import Configuration from '../services/Configuration';
import Rate from '../services/Rate';

export default {
  name: 'Home',
  data() {
    return {
      drawer: true,
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
          permission: this.$permissions.SHOW_TABELS.name,
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
          permission: this.$permissions.SHOW_MOTIVATIONS.name,
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
          to: this.$hasRole(5) ? { name: 'accounting' } : '/shipments',
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
      configurations: [],
    };
  },
  methods: {
    getAll() {
      Configuration.getAll().then((configurations) => {
        this.configurations = configurations.filter(item => item.id > 3 && item.id < 6);
      });
    },
    update(id, value) {
      Rate.create({
        marketRate: this.configurations[0].value,
        exchangeRate: this.configurations[1].value,
        officialRate: this.configurations[2].value,
      });
      Configuration.update(id, value).then(() => {
        this.$store.commit('setMessage', 'Обновлено');
      }).catch((error) => {
        this.$store.commit('setMessage', error.message);
      });
    },
  },
  created() {
    this.getAll();
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
