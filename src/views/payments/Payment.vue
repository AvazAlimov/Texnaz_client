<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'payments' }")
            v-icon arrow_back
        .title Оплата
        v-flex(xs12)
            .white.border.pa-4.mt-3
                v-layout(row wrap)
                    v-flex(xs12)
                        v-layout.mb-2(align-center)
                          .title Номер оплаты
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ payment.id }}
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
                          .subheading {{ balance.toFixed(2) || 0 }} $
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

export default {
  name: 'Payment',
  data: () => ({
    loading: false,
    payment: {
      manager: {},
      user: {},
      client: {},
      createdAt: new Date(),
    },
  }),
  computed: {
    balance() {
      if (this.payment.client.payments) {
        let balance = 0;
        this.payment.client.payments.forEach((payment) => {
          if (payment.approved) {
            balance += payment.sum / payment.ratio;
          }
        });
        return balance;
      }
      return 0;
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      Payment.get(this.$route.params.id)
        .then((payment) => {
          this.payment = payment;
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    approve() {
      this.loading = true;
      Payment.approve(this.$route.params.id)
        .then(() => {
          this.$router.push({ name: 'payments' });
          window.location.reload();
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
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
