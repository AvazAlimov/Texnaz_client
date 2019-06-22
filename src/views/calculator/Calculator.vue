<template lang="pug">
  div
    v-layout(row wrap v-if="path == 'calculator'")
        v-flex.mb-3(xs12 v-if="$hasPermission($permissions.SHOW_CALCULATOR_NON_APPROVED.name)")
            .border.white
              .title.ml-4.my-3 РАСЧЕТЫ
              v-divider
              v-data-table(
                :headers="headers"
                :items="notApprovedBatches"
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
                        v-icon(small color="secondary") edit
                      v-btn.mx-0(icon @click="remove(props.item.id)")
                        v-icon(small color="red") delete
              v-divider
              v-layout
                v-spacer
                v-btn.ma-2(flat @click="create" color="secondary") Добавить
        v-flex.mb-3(xs12 v-if="$hasPermission($permissions.SHOW_CALCULATOR_APPROVED.name)")
          .border.white.mt-3
            .title.ml-4.my-3 УТВЕРЖДЕННЫЕ РАСЧЕТЫ
            v-divider
            v-data-table(
                :headers="headers"
                :items="approvedBatches"
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
                        v-icon(small color="secondary") edit
                      v-btn.mx-0(icon @click="remove(props.item.id)")
                        v-icon(small color="red") delete
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
          text: 'Название',
          value: 'name',
        },
        {
          text: 'Номер',
          value: 'number',
        },
        {
          text: 'Дата',
          value: 'date',
        },
        {
          text: 'Склад',
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
    approvedBatches() {
      return this.batches.filter(batch => batch.approved);
    },
    notApprovedBatches() {
      return this.batches.filter(batch => !batch.approved);
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
