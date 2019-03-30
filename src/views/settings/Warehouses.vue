<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings' }")
            v-icon arrow_back
        .title СКЛАДЫ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="warehouses" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td {{ props.item.owner }}
                        td {{ props.item.company }}
                        td {{ props.item.type }}
                        td
                            v-layout
                                v-btn(icon
                                  :to="{ name: 'settings_warehouse', params: { id: props.item.id }}"
                                ).mx-0
                                    v-icon(color="primary" small) edit
                                v-btn(icon @click="remove(props.item.id)").mx-0
                                    v-icon(color="primary" small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary"
                      :to="{ name: 'settings_warehouse' }"
                    ) Добавить
</template>

<script>
import Warehouse from '@/services/Warehouse';

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
          text: 'Компания',
          value: 'company',
        },
        {
          text: 'Тип',
          value: 'local',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      warehouses: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.warehouses = [];
      Warehouse.getAll()
        .then((warehouses) => {
          this.warehouses = warehouses;
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
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
</style>
