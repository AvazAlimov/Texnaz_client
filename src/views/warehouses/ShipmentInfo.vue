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
                v-btn.ma-0(flat :loading="btnLoading"
                  :disabled="btnLoading" icon color="green" @click="approve(props.item.id)")
                  v-icon(small) check
                v-btn.ma-0(flat icon color="red" @click="reject(props.item.id)")
                  v-icon(small) close
</template>

<script>
import Sale from '@/services/Sale';
import calculate from '@/utils/Sale';
import Configuration from '@/services/Configuration';

export default {
  name: 'ShippingSales',
  data: () => ({
    loading: false,
    sales: [],
    btnLoading: false,
    officialRate: 0,
    exchangeRate: 0,
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
      Promise.all([
        Sale.getByShipped(this.$route.params.id, 0),
        Configuration.getAll(),
      ])
        .then((result) => {
          const [sales, configs] = result;
          this.sales = sales;
          this.exchangeRate = (configs.find(conf => conf.id === 4)).value;
          this.officialRate = (configs.find(conf => conf.id === 5)).value;
        })
        .catch(error => this.$emit('setMessage', error.message))
        .finally(() => { this.loading = false; this.btnLoading = false; });
    },
    approve(saleId) {
      this.btnLoading = true;
      this.loading = true;
      Sale.approveShipment(saleId, this.officialRate, this.exchangeRate).then((sale) => {
        console.log(sale);
        const price = sale.items.reduce((a, b) => a + b.debtPrice, 0);
        const priceUSD = ((sale.type === 1 || sale.type === 4)
          ? (price / this.officialRate) : price);
        calculate(
          sale.clientId,
          priceUSD,
          sale.officialRate,
        )
          .then(() => {
            this.getAll();
          }).catch(err => this.$commit('setMessage', err.message));
      })
        .catch(error => this.$emit('setMessage', error.message));
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
