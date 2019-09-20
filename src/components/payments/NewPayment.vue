<template lang="pug">
.white.border.pa-3
    .title Новая оплата
    v-layout(row wrap)
        v-flex(xs6)
            v-text-field(
                v-model="number"
                label="Номер"
                name="Номер"
                color="secondary"
                v-validate="'required'"
                :error="!isUnique"
            )
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
                    excluded: '0',\
                }"
            )
            v-menu(
              v-model="datemenu"
              :close-on-content-click="false"
              min-width="290px"
            )
              template(v-slot:activator="{ on }")
                v-text-field(
                  readonly
                  v-on="on"
                  v-model="date"
                  label="Data"
                )
              v-date-picker(
                v-model="date"
                @input="datemenu = false"
                :max="maximum"
              )
        v-flex(xs6)
            v-select(
                color="secondary"
                v-model="provinceId"
                label="Область"
                :items="provinces"
                item-text="name"
                item-value="id"
                clearable
            )
            v-select(
                color="secondary"
                v-model="managerId"
                label="Mенеджеры"
                :items="provinceManagers"
                item-text="name"
                item-value="id"
                clearable
            )
            v-combobox(
                v-model="client"
                :items="filteredClients"
                auto-select-first
                item-value="client"
                item-text="name"
                color="secondary"
                label="Клиент"
                name="Клиент"
                v-validate="'required'"
                clearable
            )
            v-text-field(
              disabled
              :label="rate ? rate.exchangeRate : '-'"
            )
        v-flex(xs12)
            v-layout(row)
                v-spacer
                v-btn.ma-0(
                    flat
                    color="secondary"
                    :loading="loading"
                    :disabled="errors.items.length > 0 || !isUnique"
                    @click="submit()"
                ) На согласование
</template>

<script>
import Payment from '@/services/Payment';
import Province from '@/services/Province';
import Territory from '@/services/Territory';
import Client from '@/services/Client';
import User from '@/services/User';
import Configuration from '@/services/Configuration';
import Rate from '@/services/Rate';

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
    ],
    number: '',
    isUnique: true,
    client: null,
    clients: [],
    provinceId: null,
    provinces: [],
    territories: [],
    managerId: null,
    managers: [],
    users: [],
    rate: null,
    rates: [],
    datemenu: false,
    date: null,
    maximum: (new Date()).toISOString().substring(0, 10),
    exchangeRate: null,
  }),
  computed: {
    filteredClients() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.client = null;
      return this.managerId ? this.clients
        .filter(item => item.managerId === this.managerId)
        .map(item => ({ name: `${item.icc} - ${item.name}`, client: item })) : [];
    },
    provinceManagers() {
      const territory = this.territories.find(item => item.provinces
        .map(el => el.id).includes(this.provinceId));
      const territorySupervisors = this.users
        .filter(user => (territory ? (user.territoryId === territory.id)
        && user.roles.map(role => role.id).includes(7) : false));
      const provinceSupervisors = territorySupervisors.filter(user => (user ? user.provinces
        .map(el => el.id).includes(this.provinceId) : false));
      return this.users.filter(user => provinceSupervisors
        .map(el => el.id).includes(user.controller ? user.controller.id : -1));
    },
    mangerClients() {
      return this.managerId
        ? this.clients.filter(item => item.managerId === this.managerId) : [];
    },
  },
  methods: {
    rateText(rateObject) {
      return `${this.$moment(rateObject.createdAt).format('DD.MM.YYYY')} - ${rateObject.exchangeRate}`;
    },
    getAll() {
      this.loading = true;
      Promise.all([
        Client.getAll(),
        User.getAll(),
        Province.getAll(),
        Territory.getAll(),
        Configuration.getExchangeRate(),
        Rate.getAll(),
      ])
        .then((result) => {
          [this.clients, this.users, this.provinces, this.territories,
            this.exchangeRate, this.rates] = result;
          this.managers = this.users.filter(user => !!user.roles.find(role => role.id === 2));
          this.rates.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
          // this.currencies[1].ratio = parseFloat(this.exchangeRate.value);
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
          number: this.number,
          provinceId: this.client.client.provinceId,
          userId: user.id,
          ratio: this.currency.id === 0 ? 1 : this.rate.exchangeRate,
          managerId: this.managerId,
          clientId: this.client.client.id,
          brandId: 0,
          sum: this.sum,
          currency: this.currency.id,
          exchangeRate: this.rate.exchangeRate,
        })
          .then(() => {
            this.number = '';
            this.rate = '';
            this.sum = 0;
            this.managerId = null;
            this.client = null;
            this.provinceId = null;
            this.currency = null;
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
  watch: {
    date(value) {
      const sorted = this.rates.filter(el => new Date(el.createdAt) < new Date(this.date))
        .sort((a, b) => (new Date(a) > new Date(b) ? 1 : -1));
      this.rate = sorted[sorted.length - 1];
      console.log(this.rate);
    },
    number(value) {
      this.isUnique = true;
      if (value) {
        Payment.getByNumber(value).then((payments) => {
          if (payments.length) {
            this.isUnique = false;
          }
        });
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>
