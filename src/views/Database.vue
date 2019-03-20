<template lang="pug">
    v-layout(row wrap )
      v-flex(xs12).mb-3
        .title БАЗА ДАННЫХ
      v-flex(xs4 v-for="card in cards" :key="card.title")
        v-list(two-line).pa-0.border
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
import Type from '../services/Type';
import Purpose from '../services/Purpose';

export default {
  name: 'Database',
  data() {
    return {
      cards: [
        {
          key: 'products',
          to: '/products',
          title: 'ТОВАРЫ',
          count: 0,
          icon: 'local_mall',
        },
        {
          key: 'users',
          to: '/users',
          title: 'ПОЛЬЗОВАТЕЛИ',
          count: 0,
          icon: 'group',
        },
        {
          key: 'warehouses',
          to: '/warehouses',
          title: 'СКЛАДЫ',
          count: 0,
          icon: 'store_mall_directory',
        },
        {
          key: 'tags',
          to: '/tags',
          title: 'ТЕГИ',
          count: 0,
          icon: 'style',
        },
        {
          key: 'types',
          to: '/types',
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
          key: 'suppliers',
          to: '/suppliers',
          title: 'ПОСТАВЩИК',
          count: 0,
          icon: 'drive_eta',
        },
        {
          key: 'supply_types',
          to: '/supply_types',
          title: 'ТИП ПОСТАВКИ',
          count: 0,
          icon: 'merge_type',
        },
        {
          key: 'expenses',
          to: '/expenses',
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
        this.getCount(Type, 'types'),
        this.getCount(Tag, 'tags'),
        this.getCount(Purpose, 'purposes'),
      ]).then((results) => {
        results.forEach((element) => {
          const card = this.cards.find(item => item.key === element.key);
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
