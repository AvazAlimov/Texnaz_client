<template lang="pug">
  div
    v-layout(row wrap align-center)
      v-btn(icon :to="{ name: 'warehouses' }" flat color="secondary")
          v-icon arrow_back
      .title {{ warehouse.name }} {{ warehouse.company }}
      v-spacer
      v-btn.mx-0(
        v-for="(card, index) in cards"
        :key="index"
        color="secondary" flat
        :to="card.to"
      ) {{ card.title }}
        v-icon.ml-2(small) {{ card.icon }}
      v-menu(bottom left)
        template(v-slot:activator="{ on }")
          v-btn(icon v-on="on" flat color="secondary")
            v-icon more_vert
        v-list.border.pa-0
          v-list-tile(:to="{ name: 'template_warehouse', params: { id: warehouse.id }}")
            v-list-tile-content
              v-list-tile-title Изменить данные
            v-list-tile-action
              v-icon(small color="secondary") edit
          v-list-tile(@click="remove")
            v-list-tile-content
              v-list-tile-title Удалить склад
            v-list-tile-action
              v-icon(small color="secondary") delete
      v-flex(xs12)
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
          icon: 'store',
          title: 'Информация',
          to: { name: 'information' },
        },
        {
          icon: 'add',
          title: 'Добавление',
          to: { name: 'stock' },
        },
        {
          icon: 'arrow_right_alt',
          title: 'Перемещение',
          // to: { name: 'move' },
        },
        {
          icon: 'hourglass_empty',
          title: 'Бронирование',
          // to: { name: 'booking' },
        },
        {
          icon: 'restore',
          title: 'Возврат',
          // to: { name: 'return' },
        },
        {
          icon: 'check',
          title: 'Инвентаризация',
          // to: { name: 'inventory' },
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
          this.$router.push({ name: 'warehouses' });
        });
    },
    remove() {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Warehouse.delete(this.warehouse.id)
          .then(() => { this.$router.push({ name: 'warehouses' }); })
          .catch((error) => {
            this.$store.commit('setMessage', error.message);
          });
      }
    },
  },
  created() {
    this.getWarehouse();
  },
};
</script>
<style>
.v-menu__content {
    box-shadow: none;
}
</style>
