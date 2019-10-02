<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .border.white
        v-data-table(
          :loading="loading"
          :headers="headers"
          :items="sales"
          hide-actions)
          template(v-slot:items="props")
            td {{ props.item.number }}
            td {{ props.item.manager.name }}
            td {{ props.item.client.name }}
            td {{ props.item.createdAt | moment('YYYY-MM-DD') }}
            td
              v-layout(row)
                v-spacer
                v-btn.ma-0(flat icon color="secondary"
                  :to="{ name: 'shipping_details', params: { itemId: props.item.id } }")
                  v-icon(small) visibility
                v-btn.ma-0(flat icon color="green" @click="approve(props.item.id)")
                  v-icon(small) check
                v-btn.ma-0(flat icon color="red" @click="reject(props.item.id)")
                  v-icon(small) close
</template>

<script>
import Sale from '@/services/Sale';

export default {
  name: 'ShippingSales',
  data: () => ({
    loading: false,
    sales: [],
    headers: [
      {
        text: 'Номер',
        value: 'number',
      },
      {
        text: 'Менеджер',
        value: 'manager.name',
      },
      {
        text: 'Клиент',
        value: 'client.name',
      },
      {
        text: 'Дата',
        value: 'createdAt',
      },
      {
        sortable: false,
      },
    ],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Sale.getByShipped(this.$route.params.id, 0)
        .then((sales) => { this.sales = sales; })
        .catch(error => this.$emit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    approve(saleId) {
      this.loading = true;
      Sale.approveShipment(saleId).then(() => this.getAll())
        .catch(error => this.$emit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    reject(saleId) {
      this.loading = true;
      Sale.rejectShipment(saleId).then(() => this.getAll())
        .catch(error => this.$emit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
