<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon to="/")
            v-icon arrow_back
        .title РАСХОДЫ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="expanses" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td.text-xs-center
                          v-icon(small) {{ props.item.is_transport ? 'check' : 'close' }}
                        td.text-xs-center
                          v-icon(small) {{ props.item.is_cash ? 'check' : 'close' }}
                        td
                            v-layout
                                v-btn(icon :to="'/expanse/' + props.item.id").mx-0
                                    v-icon(color="primary" small) edit
                                v-btn(icon @click="remove(props.item.id)").mx-0
                                    v-icon(color="primary" small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary" to="/expanse") Добавить
</template>

<script>
import Expanse from '../services/Expanse';

export default {
  name: 'Expanse',
  data() {
    return {
      headers: [
        {
          text: 'Название',
          value: 'name',
        },
        {
          text: 'Для транспорта',
          value: 'is_transport',
          sortable: false,
        },
        {
          text: 'Наличные',
          value: 'is_cash',
          sortable: false,
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      expanses: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.expanses = [];
      Expanse.getAll()
        .then((expanses) => { this.expanses = expanses; })
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Expanse.delete(id)
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
