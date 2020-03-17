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
            :pagination.sync="pendingPagination"
            :rows-per-page-items="pendingPagination.rowsPerPageItems"
            :total-items="totalPendingsNumber"
            :loading="loading"
            :items="pendings"
          )
            template(v-slot:items="props")
              td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.number }}
              td {{ props.item.client.name }}
              td {{ props.item.client.icc }}
                | {{ props.item.manufacturer ? `${props.item.brand.manufacturer}` : '' }}
              td {{ props.item.manager.name }}
              td {{ props.item.client.balance || 0 | roundUp | readable }} $
              td {{ readable((props.item.sum / props.item.ratio)) }} $
              td {{ props.item.exchangeRate }}
              td {{ props.item.user.name }}
              td
                v-layout
                  v-tooltip(top v-if="props.item.comment.length")
                    template(v-slot:activator="{ on }")
                      v-btn(icon v-on="on").ma-0
                        v-icon(color="secondary" small) message
                    span {{ props.item.comment }}
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
            :pagination.sync="approvedPagination"
            :rows-per-page-items="approvedPagination.rowsPerPageItems"
            :total-items="totalApprovedsNumber"
            :loading="loading"
            :items="approveds"
          )
            template(v-slot:items="props")
              td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.number }}
              td {{ props.item.client.name }}
              td {{ props.item.client.icc }}
                | {{ props.item.manufacturer ? `${props.item.brand.manufacturer}` : '' }}
              td {{ props.item.manager.name }}
              td {{ props.item.client.balance || 0 | roundUp | readable }} $
              td {{ readable((props.item.sum / props.item.ratio)) }} $
              td {{ props.item.exchangeRate }}
              td {{ props.item.user.name }}
              td
                v-tooltip(top v-if="props.item.comment.length")
                  template(v-slot:activator="{ on }")
                    v-btn(icon v-on="on").ma-0
                      v-icon(color="secondary" small) message
                  span {{ props.item.comment }}
    router-view
</template>

<script>
import Payment from '@/services/Payment';

export default {
  name: 'Payments',
  data: () => ({
    loading: false,
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
        text: 'Kурс',
        value: 'rate',
      },
      {
        text: 'Принял',
        value: 'userId',
      },
      {
        sortable: false,
      },
    ],
    totalPending: 0,
    totalApproved: 0,
    pendingPagination: {
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsPerPageItems: [5, 10, 25, { text: 'Все', value: -1 }],
    },
    approvedPagination: {
      descending: false,
      page: 1,
      rowsPerPage: 5,
      sortBy: 'Дата',
      rowsPerPageItems: [5, 10, 25, { text: 'Все', value: -1 }],
    },
    totalPendingsNumber: 0,
    totalApprovedsNumber: 0,
    pendings: [],
    approveds: [],
  }),
  watch: {
    pendingPagination: {
      handler(pagination) {
        this.getSync(pagination, 0);
      },
      deep: true,
    },
    approvedPagination: {
      handler(pagination) {
        this.getSync(pagination, 1);
      },
      deep: true,
    },
  },
  methods: {
    readable(value) {
      return this.$options.filters.readable(
        this.$options.filters.roundUp(value || 0),
      );
    },
    getSync(pagination, approved) {
      this.loading = true;
      Payment.getPagined(
        pagination.page - 1,
        pagination.rowsPerPage === -1 ? 'null' : pagination.rowsPerPage,
        approved,
      )
        .then(({ total, data }) => {
          this[approved ? 'totalApprovedsNumber' : 'totalPendingsNumber'] = total;
          this[approved ? 'approveds' : 'pendings'] = data;
          this.loading = false;
        });
    },
    getAll() {
      this.loading = true;
      Payment.getAll()
        .then((payments) => {
          this.totalPending = payments.filter(payment => !payment.approved)
            .map(el => (el.sum / el.ratio).toFixed(2))
            .reduce((a, b) => Number(a) + Number(b), 0);
          this.totalApproved = payments.filter(payment => payment.approved)
            .map(el => (el.sum / el.ratio).toFixed(2))
            .reduce((a, b) => Number(a) + Number(b), 0);
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
