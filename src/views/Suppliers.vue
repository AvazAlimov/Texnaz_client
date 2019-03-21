<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon to="/")
            v-icon arrow_back
        .title ПОСТАВЩИКИ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="suppliers" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td {{ props.item.country }}
                        td
                            v-layout
                                v-btn(icon :to="'/supplier/' + props.item.id").mx-0
                                    v-icon(color="primary" small) edit
                                v-btn(icon @click="remove(props.item.id)").mx-0
                                    v-icon(color="primary" small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary" to="/supplier") Добавить
</template>

<script>
import Supplier from '../services/Supplier';

export default {
  name: 'Supplier',
  data() {
    return {
      headers: [
        {
          text: 'Название',
          value: 'name',
        },
        {
          text: 'Страна',
          value: 'country',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      suppliers: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.suppliers = [];
      Supplier.getAll()
        .then((suppliers) => { this.suppliers = suppliers; })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Supplier.delete(id)
          .then(() => { this.getAll(); })
          .catch((error) => {
            this.$store.commit('setMessage', error.message);
          });
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
</style>
