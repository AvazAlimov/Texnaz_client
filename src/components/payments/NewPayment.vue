<template lang="pug">
.white.border.pa-3
    .title Новая оплата
    v-layout(row wrap)
        v-flex(xs6)
            v-select(
                color="secondary"
                v-model="currency"
                label="Тип валюты"
                :items="currencies"
                item-text="name"
                return-object
                name="Тип валюты"
                v-validate="'required'"
            )
            v-text-field(
                color="secondary"
                v-model="sum"
                label="Сумма"
                name="Сумма"
                v-validate="{\
                    required: true,\
                    decimal: true,\
                }"
            )
            v-select(
                color="secondary"
                v-model="brandId"
                label="Бренд"
                :items="brands"
                item-text="name"
                item-value="id"
                clearable
            )
        v-flex(xs6)
            v-select(
                color="secondary"
                v-model="managerId"
                label="Менеджер"
                :items="managers"
                item-text="name"
                item-value="id"
                name="Менеджер"
                v-validate="'required'"
                clearable
            )
            v-select(
                color="secondary"
                v-model="clientId"
                label="Клиент"
                :items="filteredClients"
                item-text="name"
                item-value="id"
                name="Клиент"
                v-validate="'required'"
                clearable
            )
        v-flex(xs12)
            v-layout(row)
                v-spacer
                v-btn.ma-0(
                    flat
                    color="secondary"
                    :loading="loading"
                    :disabled="errors.items.length > 0"
                    @click="submit()"
                ) На согласование
</template>

<script>
import Payment from '@/services/Payment';
import Client from '@/services/Client';
import Brand from '@/services/Brand';
import User from '@/services/User';
import Configuration from '@/services/Configuration';

export default {
  name: 'NewPayment',
  props: {
    postAction: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    sum: 0,
    currency: null,
    currencies: [
      {
        id: 0,
        name: 'Доллар',
        ratio: 1,
      },
      {
        id: 1,
        name: 'Сум',
        ratio: 1,
      },
      {
        id: 2,
        name: 'Сум БН',
        ratio: 1,
      },
    ],
    clientId: null,
    clients: [],
    brandId: null,
    brands: [],
    managerId: null,
    managers: [],
    exchangeRate: null,
  }),
  computed: {
    filteredClients() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.clientId = null;
      return this.managerId ? this.clients.filter(item => item.managerId === this.managerId) : [];
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Client.getAll(),
        User.getAll(),
        Brand.getAll(),
        Configuration.getExchangeRate(),
      ])
        .then((result) => {
          [this.clients, this.managers, this.brands, this.exchangeRate] = result;
          this.managers = this.managers.filter(user => !!user.roles.find(role => role.id === 2));
          this.currencies[1].ratio = parseFloat(this.exchangeRate.value);
          this.currencies[2].ratio = parseFloat(this.exchangeRate.value);
          this.$validator.validate();
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    submit() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.loading = true;
        Payment.create({
          userId: user.id,
          ratio: this.currency.ratio,
          managerId: this.managerId,
          clientId: this.clientId,
          brandId: this.brandId,
          sum: this.sum,
        })
          .then(() => {
            this.sum = 0;
            this.managerId = null;
            this.clientId = null;
            this.brandId = null;
            this.$validator.validate();
            this.postAction();
          })
          .catch((error) => {
            this.$store.commit('setMessage', error.message);
          })
          .finally(() => { this.loading = false; });
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>
