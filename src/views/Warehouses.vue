<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon to="/")
            v-icon arrow_back
        .title СКЛАДЫ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="warehouses" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td {{ props.item.owner }}
                        td {{ props.item.address }}
                        td {{ props.item.company }}
                        td {{ getSupplyName(props.item.supply) }}
                        td
                            v-layout
                                v-btn(icon :to="'/warehouse/' + props.item.id").mx-0
                                    v-icon(color="primary" small) edit
                                v-btn(icon @click="remove(props.item.id)").mx-0
                                    v-icon(color="primary" small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary" to="/warehouse") Добавить
</template>

<script>
import Warehouse from '../services/Warehouse';
import Supply from '../services/Supply';

export default {
  name: 'Warehouses',
  data() {
    return {
      headers: [
        {
          text: 'Название',
          value: 'name',
        },
        {
          text: 'Владелец',
          value: 'owner',
        },
        {
          text: 'Адрес',
          value: 'address',
        },
        {
          text: 'Компания',
          value: 'company',
        },
        {
          text: 'Тип',
          value: 'supply',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      warehouses: [],
      supplies: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.warehouses = [];
      Promise.all([
        Supply.getAll(),
        Warehouse.getAll(),
      ]).then((results) => {
        [this.supplies, this.warehouses] = results;
      })
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Warehouse.delete(id)
          .then(() => { this.getAll(); })
          .catch((error) => {
            this.$store.commit('setMessage', error.message);
          });
      }
    },
    getSupplyName(id) {
      return (this.supplies.find(item => id === item.id) || { name: '-' }).name;
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
</style>
