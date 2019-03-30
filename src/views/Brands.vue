<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon to="/")
            v-icon arrow_back
        .title Бренды
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="brands" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td {{ props.item.country }}
                        td
                            v-layout
                                v-btn(icon :to="'/brand/' + props.item.id").mx-0
                                    v-icon(color="primary" small) edit
                                v-btn(icon @click="remove(props.item.id)").mx-0
                                    v-icon(color="primary" small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary" to="/brand") Добавить
</template>

<script>
import Brand from '../services/Brand';

export default {
  name: 'Brand',
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
      brands: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.brands = [];
      Brand.getAll()
        .then((brands) => { this.brands = brands; })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Brand.delete(id)
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
