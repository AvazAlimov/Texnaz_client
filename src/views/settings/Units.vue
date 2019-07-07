<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings' }").tertiary--text
            v-icon arrow_back
        .title.tertiary--text ЕДИНИЦЫ ИЗМЕРЕНИЯ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="units" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td
                            v-layout
                                v-btn.mx-0(icon flat color="secondary"
                                  :to="{ name: 'unit', params: {id: props.item.id}}"
                                )
                                    v-icon(small) edit
                                v-btn(icon flat color="red" @click="remove(props.item.id)").mx-0
                                    v-icon(small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-0.mb-1.mr-1(flat color="secondary"
                      :to="{ name: 'unit' }"
                    ) Добавить
</template>

<script>
import Unit from '@/services/Unit';

export default {
  name: 'Units',
  data() {
    return {
      headers: [
        {
          text: 'Название',
          value: 'name',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      units: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.units = [];
      Unit.getAll()
        .then((units) => { this.units = units; })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Unit.delete(id)
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
