<template lang="pug">
  div
    v-layout(row wrap align-center v-if="path == 'warehouse'")
      v-btn(icon :to="{ name: 'warehouses' }")
          v-icon arrow_back
      .title СКЛАД: {{ warehouse.name }} - {{ warehouse.owner.name }}
      v-flex(xs12)

      v-flex(xs4 v-for="(card, index) in cards" :key="index")
        v-list.pa-0.border(two-line)
          v-list-tile(:to="card.to")
            v-list-tile-content
              v-list-tile-title {{ card.title }}
            v-list-tile-action
              v-icon(large) {{ card.icon }}

    router-view
</template>

<script>
import Warehouse from '@/services/Warehouse';

export default {
  name: 'Warehouse',
  data() {
    return {
      cards: [
        {
          icon: 'info',
          title: 'Информация',
          to: { name: 'info' },
        },
        {
          icon: 'library_add',
          title: 'Добавление',
          to: { name: 'stock' },
        },
        {
          icon: 'shopping_cart',
          title: 'Перемещение',
          to: { name: 'move' },
        },
        {
          icon: 'book',
          title: 'Бронирование',
          to: { name: 'booking' },
        },
        {
          icon: 'assignment_return',
          title: 'Возврат',
          to: { name: 'return' },
        },
        {
          icon: 'check_circle',
          title: 'Инвентаризация',
          to: { name: 'inventory' },
        },
      ],
      warehouse: {
        owner: {},
      },
    };
  },
  computed: {
    path() {
      return this.$route.name;
    },
  },
  methods: {
    getWarehouse() {
      Warehouse.get(this.$route.params.id)
        .then((warehouse) => { this.warehouse = warehouse; })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        });
    },
  },
  created() {
    this.getWarehouse();
  },
};
</script>
