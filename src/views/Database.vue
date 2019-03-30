<template lang="pug">
    v-layout(row wrap )
      v-flex(xs12).mb-1
        .title НАСТРОЙКИ
      v-flex(xs4 v-for="(section, index) in cards" :key="index")
        v-list.pa-0.border.my-2(v-for="card in section" :key="card.title" two-line)
          v-list-tile(:to="card.to")
            v-list-tile-content
              v-list-tile-title {{ card.title }}
              v-list-tile-sub-title {{ card.count }}
            v-list-tile-action
              v-icon(large) {{ card.icon }}
</template>

<script>
import Product from '../services/Product';
import Unit from '../services/Unit';
import Tag from '../services/Tag';
import ProductType from '../services/ProductType';
import Purpose from '../services/Purpose';
import User from '../services/User';
import Warehouse from '../services/Warehouse';
import Configuration from '../services/Configuration';
import Brand from '../services/Brand';
import Expanse from '../services/Expanse';

export default {
  name: 'Database',
  data() {
    return {
      cards: [
        // PRODUCT DETAILS
        [
          {
            key: 'products',
            to: '/products',
            title: 'ТОВАРЫ',
            count: 0,
            icon: 'local_mall',
          },
          {
            key: 'brands',
            to: '/brands',
            title: 'Бренды',
            count: 0,
            icon: 'drive_eta',
          },
          {
            key: 'product_types',
            to: '/product_types',
            title: 'ТИПЫ ПРОДУКТОВ',
            count: 0,
            icon: 'turned_in',
          },
          {
            key: 'units',
            to: '/units',
            title: 'ЕДИНИЦЫ ИЗМЕРЕНИЯ',
            count: 0,
            icon: 'extension',
          },
          {
            key: 'purposes',
            to: '/purposes',
            title: 'НАЗНАЧЕНИЕ',
            count: 0,
            icon: 'label',
          },
          {
            key: 'tags',
            to: '/tags',
            title: 'ТЕГИ',
            count: 0,
            icon: 'style',
          },
        ],
        // WAREHOUSE
        [
          {
            key: 'warehouses',
            to: '/warehouses',
            title: 'СКЛАДЫ',
            count: 0,
            icon: 'store_mall_directory',
          },
        ],
        // CONFIGURATIONS
        [
          {
            key: 'users',
            to: '/users',
            title: 'ПОЛЬЗОВАТЕЛИ',
            count: 0,
            icon: 'group',
          },
          {
            key: 'expanses',
            to: '/expanses',
            title: 'РАСХОДЫ',
            count: 0,
            icon: 'attach_money',
          },
          {
            key: 'configurations',
            to: '/configurations',
            title: 'КОНФИГУРАЦИИ',
            count: 0,
            icon: 'settings',
          },
        ],
      ],
    };
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
        this.getCount(Warehouse, 'warehouses'),
        this.getCount(Configuration, 'configurations'),
        this.getCount(Brand, 'brands'),
        this.getCount(Expanse, 'expanses'),
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
