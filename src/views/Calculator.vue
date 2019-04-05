<template lang="pug">
  div
    v-layout(row wrap v-if="path == 'calculator'")
        v-flex(xs12).mb-3
            .title КАЛЬКУЛЯТОР
            v-flex(xs12).mt-3
                .border.white
                    v-data-table(
                        :headers="headers"
                        :items="batches"
                        :loading="loading"
                        hide-actions)
                        template(v-slot:items="props")
                          td {{ props.item.name || '-' }}
                          td {{ props.item.number || '-' }}
                          td {{ props.item.date ? props.item.date.substring(0, 10) : '-' }}
                          td {{ props.item.Warehouse ? props.item.Warehouse.name : '-' }}
                          td
                            v-layout
                                v-btn.mx-0(icon
                                  :to="{name: 'batch_info', params: {id: props.item.id}}")
                                  v-icon(color="primary" small) edit
                                v-btn.mx-0(icon @click="remove(props.item.id)")
                                  v-icon(color="primary" small) delete
                    v-divider
                    v-layout
                        v-spacer
                        v-btn.ma-2(flat color="primary" @click="create") Добавить
    router-view
</template>

<script>
import Batch from '@/services/Batch';

export default {
  name: 'Calculator',
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Number',
          value: 'number',
        },
        {
          text: 'Date',
          value: 'date',
        },
        {
          text: 'Warehouse',
          value: 'warehouse',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      batches: [],
      loading: false,
    };
  },
  computed: {
    path() {
      return this.$route.name;
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      this.batches = [];
      Batch
        .getAll()
        .then((batches) => { this.batches = batches; })
        .finally(() => { this.loading = false; });
    },
    create() {
      Batch.create()
        .then((batch) => {
          this.$router.push({ name: 'batch', params: { id: batch.id } });
        });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Batch.delete(id)
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

<style script>

</style>
