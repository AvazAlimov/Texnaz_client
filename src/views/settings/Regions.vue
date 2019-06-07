<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings' }")
            v-icon arrow_back
        .title РЕГИОНЫ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="regions" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.index + 1 }}
                        td {{ props.item.province.name }}
                        td {{ props.item.name }}
                        td
                            v-layout
                                v-btn.mx-0(icon flat color="secondary"
                                  :to="{ name: 'region', params:{ id: props.item.id }}"
                                )
                                    v-icon(small) edit
                                v-btn(icon color="red" flat
                                  @click="remove(props.item.id)").mx-0
                                    v-icon(small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-0.mr-1.mb-1(flat color="secondary"
                      :to="{ name: 'region' }"
                    ) Добавить
</template>

<script>
import Region from '@/services/Region';

export default {
  name: 'Purposes',
  data() {
    return {
      headers: [
        {
          text: 'Номер',
          value: 'number',
          sortable: false,
        },
        {
          text: 'Область',
          value: 'province.name',
        },
        {
          text: 'Регион',
          value: 'name',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      regions: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.regions = [];
      Region.getAll()
        .then((regions) => { this.regions = regions; })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Region.delete(id)
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
