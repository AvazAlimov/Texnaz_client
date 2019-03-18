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
export default {
  name: 'Database',
  data() {
    return {
      cards: [
        {
          to: '/products',
          title: 'ТОВАРЫ',
          count: 3024,
          icon: 'local_mall',
        },
        {
          to: '/users',
          title: 'ПОЛЬЗОВАТЕЛИ',
          count: 12,
          icon: 'group',
        },
        {
          to: '/warehouses',
          title: 'СКЛАДЫ',
          count: 4,
          icon: 'store_mall_directory',
        },
        {
          to: '/tags',
          title: 'ТЕГИ',
          count: 48,
          icon: 'style',
        },
        {
          to: '/types',
          title: 'ТИПЫ ПРОДУКТОВ',
          count: 8,
          icon: 'turned_in',
        },
        {
          to: '/units',
          title: 'ЕДИНИЦА ИЗМЕРЕНИЯ',
          count: 3,
          icon: 'extension',
        },
        {
          to: '/purposes',
          title: 'НАЗНАЧЕНИЕ',
          count: 9,
          icon: 'label',
        },
        {
          to: '/supplier',
          title: 'ПОСТАВЩИК',
          count: 32,
          icon: 'drive_eta',
        },
        {
          to: '/supply_types',
          title: 'ТИП ПОСТАВКИ',
          count: 2,
          icon: 'merge_type',
        },
        {
          to: '/expenses',
          title: 'РАСХОДЫ',
          count: 18,
          icon: 'attach_money',
        },
        {
          to: '/configurations',
          title: 'КОНФИГУРАЦИИ',
          count: 24,
          icon: 'settings',
        },
      ],
    };
  },
};
</script>

<style scoped>
  .border {
     border: 1px solid rgba(0,0,0,0.12) !important;
  }
</style>
