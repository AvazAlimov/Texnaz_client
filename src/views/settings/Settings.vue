<template lang="pug">
  div
    v-layout(row wrap v-if="path == 'settings'")
      v-flex(xs12).mb-1
        .title.tertiary--text НАСТРОЙКИ
      v-flex(xs6 v-for="(section, index) in cards" :key="index")
        template(v-for="card in section")
          v-list.pa-0.border.my-2(
            :key="card.title" two-line
            v-if="card.permission ? $hasPermission(card.permission) : true"
          )
            v-list-tile(:to="'/settings' + card.to")
              v-list-tile-content
                v-list-tile-title {{ card.title }}
                v-list-tile-sub-title {{ card.count }}
              v-list-tile-action
                v-icon(large color="secondary") {{ card.icon }}
    router-view
</template>

<script>
import Product from '@/services/Product';
import Unit from '@/services/Unit';
import Tag from '@/services/Tag';
import ProductType from '@/services/ProductType';
import Purpose from '@/services/Purpose';
import User from '@/services/User';
import Configuration from '@/services/Configuration';
import Brand from '@/services/Brand';
import Expanse from '@/services/Expanse';
import Region from '@/services/Region';

export default {
  name: 'Database',
  data() {
    return {
      cards: [
        // CONFIGURATIONS
        [
          {
            key: 'users',
            to: '/users',
            title: 'ПОЛЬЗОВАТЕЛИ',
            count: 0,
            icon: 'group',
            permission: this.$permissions.SHOW_SETTINGS_USERS.name,
          },
          {
            key: 'expanses',
            to: '/expanses',
            title: 'РАСХОДЫ',
            count: 0,
            icon: 'attach_money',
            permission: this.$permissions.SHOW_SETTINGS_EXPANSES.name,
          },
          {
            key: 'configurations',
            to: '/configurations',
            title: 'ПОКАЗАТЕЛИ',
            count: 0,
            icon: 'settings',
            permission: this.$permissions.SHOW_SETTINGS_CONFIGURATIONS.name,
          },
          {
            key: 'regions',
            to: '/regions',
            title: 'Регионы',
            count: 0,
            icon: 'map',
            permission: this.$permissions.SHOW_SETTINGS_REGIONS.name,
          },
          {
            key: 'themes',
            to: '/themes',
            title: 'Темы',
            count: 7,
            icon: 'format_paint',
          },
        ],
        // PRODUCT DETAILS
        [
          {
            key: 'products',
            to: '/products',
            title: 'ТОВАРЫ',
            count: 0,
            icon: 'local_mall',
            permission: this.$permissions.SHOW_SETTINGS_PRODUCTS.name,
          },
          {
            key: 'brands',
            to: '/brands',
            title: 'Бренды',
            count: 0,
            icon: 'drive_eta',
            permission: this.$permissions.SHOW_SETTINGS_BRANDS.name,
          },
          {
            key: 'product_types',
            to: '/product_types',
            title: 'ТИПЫ ПРОДУКТОВ',
            count: 0,
            icon: 'turned_in',
            permission: this.$permissions.SHOW_SETTINGS_PRODUCT_TYPES.name,
          },
          {
            key: 'units',
            to: '/units',
            title: 'ЕДИНИЦЫ ИЗМЕРЕНИЯ',
            count: 0,
            icon: 'extension',
            permission: this.$permissions.SHOW_SETTINGS_UNITS.name,
          },
          {
            key: 'purposes',
            to: '/purposes',
            title: 'НАЗНАЧЕНИЕ',
            count: 0,
            icon: 'label',
            permission: this.$permissions.SHOW_SETTINGS_PURPOSES.name,
          },
          {
            key: 'tags',
            to: '/tags',
            title: 'ТЕГИ',
            count: 0,
            icon: 'style',
            permission: this.$permissions.SHOW_SETTINGS_TAGS.name,
          },
        ],
      ],
    };
  },
  computed: {
    path() {
      return this.$route.name;
    },
  },
  methods: {
    getCount(Service, key) {
      return new Promise((resolve) => {
        Service.getAll().then((items) => {
          resolve({
            key,
            count: items.length,
          });
        });
      });
    },
    getAllCounts() {
      Promise.all([
        this.getCount(Product, 'products'),
        this.getCount(Unit, 'units'),
        this.getCount(ProductType, 'product_types'),
        this.getCount(Tag, 'tags'),
        this.getCount(Purpose, 'purposes'),
        this.getCount(User, 'users'),
        this.getCount(Configuration, 'configurations'),
        this.getCount(Brand, 'brands'),
        this.getCount(Expanse, 'expanses'),
        this.getCount(Region, 'regions'),
      ]).then((results) => {
        results.forEach((element) => {
          const cards = [];
          this.cards.forEach(section => section.forEach(card => cards.push(card)));
          const card = cards.find(item => item.key === element.key);
          if (card) card.count = element.count;
        });
      });
    },
  },
  created() {
    this.getAllCounts();
  },
};
</script>
