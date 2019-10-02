<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings' }").tertiary--text
            v-icon arrow_back
        .title.tertiary--text НАЗНАЧЕНИЕ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="purposes" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.number }}
                        td {{ props.item.description }}
                        td
                            v-layout
                                v-btn.mx-0(icon flat color="secondary"
                                  :to="{ name: 'purpose', params:{ id: props.item.id }}"
                                )
                                    v-icon(small) edit
                                v-btn.mx-0(icon color="red"
                                  flat @click="remove(props.item.id)")
                                    v-icon(small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-0.mb-1.mr-1(flat color="secondary"
                      :to="{ name: 'purpose' }"
                    ) Добавить
</template>

<script>
import Purpose from '@/services/Purpose';

export default {
  name: 'Purposes',
  data() {
    return {
      headers: [
        {
          text: 'Номер',
          value: 'number',
          width: 100,
        },
        {
          text: 'Описание',
          value: 'description',
          sortable: false,
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      purposes: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.purposes = [];
      Purpose.getAll()
        .then((purposes) => { this.purposes = purposes; })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Purpose.delete(id)
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
