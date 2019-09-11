<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'payments' }").dashboardTertiary--text
            v-icon arrow_back
        .title.dashboardTertiary--text Оплата
        v-flex(xs12)
            .white.border.pa-4.mt-3
                v-layout(row wrap)
                    v-flex(xs12)
                        v-layout.mb-2(align-center)
                          .title Номер оплаты
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ payment.number }}
                        v-layout.my-2(align-center)
                          .title Дата приема
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ payment.createdAt | moment('YYYY-MM-DD') }}
                        v-layout.my-2(align-center)
                          .title Принял
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ payment.user.name }}
                        v-layout.my-2(align-center)
                          .title Менеджер
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ payment.manager.name }}
                        v-layout.my-2(align-center)
                          .title Клиент
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ payment.client.name }}
                        v-layout.my-2(align-center)
                          .title Клиент ИКК
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ payment.client.icc }}
                        v-layout.my-2(align-center)
                          .title Баланс клиента
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ payment.client.balance || 0 | roundUp | readable}} $
                        v-layout.my-2(align-center)
                          .title Сумма оплаты
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ (payment.sum / payment.ratio).toFixed(2) }} $
                v-layout(row)
                  v-spacer
                  v-btn.ma-0(flat color="secondary" @click="approve()") Утвердить
                  v-btn.ma-0(flat color="secondary" @click="remove()") Отменить
</template>

<script>
import Payment from '@/services/Payment';
import { calculate } from '@/utils/Payment';
import Sale from '@/services/Sale';

export default {
  name: 'Payment',
  data: () => ({
    loading: false,
    sales: [],
    payment: {
      currency: 0,
      sum: 0,
      exchangeRate: 0,
      manager: {},
      user: {},
      client: {},
      provinceId: null,
      createdAt: new Date(),
    },
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Payment.get(this.$route.params.id),
        Sale.getAll(),
      ]).then((result) => {
        [this.payment, this.sales] = result;
      })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    async approve() {
      this.loading = true;

      calculate(this.payment.client.id,
        this.payment.currency,
        this.payment.sum,
        Number.parseFloat(this.payment.exchangeRate))
        .then(() => {
          Payment.approve(this.$route.params.id)
            .then(() => {
              this.$router.push({ name: 'payments' });
              window.location.reload();
            })
            .catch((error) => {
              this.$store.commit('setMessage', error.message);
            })
            .finally(() => { this.loading = false; });
        })
        .catch(err => this.$store.commit('setMessage', err.message));
    },
    remove() {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Payment.delete(this.$route.params.id)
          .then(() => {
            this.$router.push({ name: 'payments' });
            window.location.reload();
          })
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
