<template lang="pug">
  div
    v-layout(row wrap align-center)
      v-btn(icon :to="{ name: 'warehouses' }" flat color="secondary").tertiary--text
          v-icon arrow_back
      .title.tertiary--text {{ warehouse.name }} {{ warehouse.company }}
      v-spacer
      v-menu(bottom left v-if="$hasRole(1)")
        template(v-slot:activator="{ on }")
          v-btn(icon v-on="on" flat color="secondary").tertiary--text
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
    v-layout(row wrap justify-end)
      v-badge(
        v-for="(card, index) in cards"
        v-if="$hasPermission(card.permission)"
        color="red"
        overlap
        :value="card.counter"
        :key="index"
      )
        template(v-slot:badge)
          span {{ card.counter }}
        v-btn.mx-0(
          small flat
          color="secondary"
          :to="card.to"
        ).tertiary--text {{ card.title }}

      v-flex(xs12).mt-2
        router-view
</template>

<script>
import Warehouse from '@/services/Warehouse';
import PreStock from '@/services/PreStock';
import Move from '@/services/Move';
import Return from '@/services/Return';
import Lost from '@/services/Lost';
import Sale from '@/services/Sale';

export default {
  name: 'Warehouse',
  data() {
    return {
      cards: [
        {
          counter: 0,
          id: 'information',
          title: 'Информация',
          to: { name: 'information' },
          permission: this.$permissions.SHOW_WAREHOUSE_INFORMATION.name,
        },
        {
          counter: 0,
          id: 'move',
          title: 'Перемещение',
          to: { name: 'move' },
          permission: this.$permissions.SHOW_WAREHOUSE_MOVE.name,
        },
        {
          counter: 0,
          id: 'booking',
          title: 'Бронирование',
          to: { name: 'booking' },
          permission: this.$permissions.SHOW_WAREHOUSE_BOOKING.name,
        },
        {
          counter: 0,
          id: 'returns',
          title: 'Возврат',
          to: { name: 'returns' },
          permission: this.$permissions.SHOW_WAREHOUSE_RETURN.name,
        },
        {
          counter: 0,
          id: 'returnWarehouse',
          title: 'Возврат на склад',
          to: { name: 'warehouseReturn' },
          permission: this.$permissions.SHOW_WAREHOUSE_RETURN.name,
        },
        {
          counter: 0,
          id: 'losts',
          title: 'Потерянные продукты',
          to: { name: 'loststocks' },
          permission: this.$permissions.SHOW_WAREHOUSE_LOST_STOCKS.name,
        },
        {
          counter: 0,
          id: 'sale',
          title: 'Реализация',
          to: { name: 'sale' },
          permission: this.$permissions.SHOW_WAREHOUSE_SALE.name,
        },
        {
          counter: 0,
          id: 'shipments',
          title: 'Отгрузки',
          to: { name: 'shipping_info' },
          permission: this.$permissions.SHOW_WAREHOUSE_SHIPMENTS.name,
        },
        {
          counter: 0,
          id: 'prestocks',
          title: 'Новое поступление',
          to: { name: 'prestocks' },
          permission: this.$permissions.SHOW_WAREHOUSE_PRE_STOCKS.name,
        },
        {
          counter: 0,
          id: 'moves',
          title: 'Прием',
          to: { name: 'acceptance' },
          permission: this.$permissions.SHOW_WAREHOUSE_ACCEPTANCE.name,
        },
      ],
      warehouse: {
        owner: {},
      },
    };
  },
  methods: {
    getAll() {
      Promise.all([
        Warehouse.get(this.$route.params.id),
        PreStock.getByWarehouse(this.$route.params.id),
        Move.getAllPending(this.$route.params.id),
        Return.getAll(this.$route.params.id),
        Lost.getAll(this.$route.params.id),
        Sale.getByShipped(this.$route.params.id, 0),
      ])
        .then((results) => {
          [this.warehouse] = results;
          this.setCounter('prestocks', results[1].length);
          this.setCounter('moves', results[2].length);
          this.setCounter('returnWarehouse', results[3].length);
          this.setCounter('losts', results[4].length);
          this.setCounter('shipments', results[5].length);
        })
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
    setCounter(id, counter) {
      const card = this.cards.find(item => item.id === id);
      card.counter = counter;
    },
  },
  created() {
    this.getAll();
  },
};
</script>
<style>
.v-menu__content {
    box-shadow: none;
}
</style>
