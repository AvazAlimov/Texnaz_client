<template lang="pug">
  div
    v-layout(row wrap v-if="$route.name == 'payments'")
      v-flex(xs12).mb-3
        .title.tertiary--text ОПЛАТЫ
      v-flex(xs12)
        NewPayment(:postAction="getAll")
      v-flex(xs12)
        .white.border
          v-layout(wrap)
            .title.ma-3 На согласование
            v-spacer
            .subheading.ma-3 Oбщая сумма: {{ readable(totalPending) }}
          v-divider
          v-data-table(
            :headers="headers"
            :items="pending"
            hide-actions
          )
            template(v-slot:items="props")
              td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.number }}
              td {{ props.item.client.name }}
              td {{ props.item.client.icc }}
              td {{ props.item.brand ? `${props.item.brand.name} ` : '-' }}
                | {{ props.item.manufacturer ? `${props.item.brand.manufacturer}` : '' }}
              td {{ props.item.manager.name }}
              td {{ readable(balance(props.item.client)) }} $
              td {{ readable((props.item.sum / props.item.ratio)) }} $
              td {{ props.item.user.name }}
              td
                v-btn(icon :to="{name: 'payment', params: {id: props.item.id}}").ma-0
                  v-icon(color="secondary" small) visibility
      v-flex(xs12)
        .white.border
          v-layout(wrap)
            .title.ma-3 Согласованные
            v-spacer
            .subheading.ma-3 Oбщая сумма: {{ readable(totalApproved) }}
          v-divider
          v-data-table(
            :headers="headers"
            :items="approved"
            hide-actions
          )
            template(v-slot:items="props")
              td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.number }}
              td {{ props.item.client.name }}
              td {{ props.item.client.icc }}
              td {{ props.item.brand ? `${props.item.brand.name} ` : '-' }}
                | {{ props.item.manufacturer ? `${props.item.brand.manufacturer}` : '' }}
              td {{ props.item.manager.name }}
              td {{ readable(balance(props.item.client)) }} $
              td {{ readable((props.item.sum / props.item.ratio)) }} $
              td {{ props.item.user.name }}
    router-view
</template>

<script>
import Payment from '@/services/Payment';

export default {
  name: 'Payments',
  data: () => ({
    headers: [
      {
        text: 'Дата',
        value: 'createdAt',
      },
      {
        text: 'Номер оплаты',
        value: 'number',
      },
      {
        text: 'Клиент',
        value: 'client.name',
      },
      {
        text: 'ИКК',
        value: 'client.icc',
      },
      {
        text: 'Бренд',
        value: 'brandId',
      },
      {
        text: 'Менеджер',
        value: 'manager',
      },
      {
        text: 'Баланс клиента',
        value: 'sum',
        sortable: false,
      },
      {
        text: 'Сумма',
        value: 'sum',
      },
      {
        text: 'Принял',
        value: 'userId',
      },
      {
        sortable: false,
      },
    ],
    payments: [],
    totalPending: 0,
    totalApproved: 0,
  }),
  computed: {
    pending() {
      return this.payments.filter(payment => !payment.approved);
    },
    approved() {
      return this.payments.filter(payment => payment.approved);
    },
  },
  methods: {
    readable(value) {
      return this.$options.filters.readable(
        this.$options.filters.roundUp(value || 0),
      );
    },
    getAll() {
      this.loading = true;
      Payment.getAll()
        .then((payments) => {
          this.payments = payments;
          this.totalPending = this.pending
            .map(el => (el.sum / el.ratio).toFixed(2))
            .reduce((a, b) => Number(a) + Number(b), 0);
          this.totalApproved = this.approved
            .map(el => (el.sum / el.ratio).toFixed(2))
            .reduce((a, b) => Number(a) + Number(b), 0);
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    balance(client) {
      if (client.payments) {
        let balance = 0;
        client.payments.forEach((payment) => {
          if (payment.approved) {
            balance += payment.sum / payment.ratio;
          }
        });
        return balance;
      }
      return 0;
    },
  },
  created() {
    this.getAll();
  },
};
</script>
