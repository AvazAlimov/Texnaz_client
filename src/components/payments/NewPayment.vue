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
                    min_value: 0,\
                    excluded: '0',\
                }"
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
                :items="clients"
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
        // divide by market rate
      },
      {
        id: 2,
        name: 'Сум БН',
        ratio: 1,
        // divide by official rate
      },
    ],
    clientId: null,
    clients: [],
    managerId: null,
    managers: [],
    configurations: [],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Client.getAll(),
        User.getAll(),
        Configuration.getAll(),
      ])
        .then((result) => {
          [this.clients, this.managers, this.configurations] = result;
          this.managers = this.managers.filter(user => !!user.roles.find(role => role.id === 2));
          this.currencies[1].ratio = parseFloat((this.configurations.find(a => a.id === 4)).value);
          this.currencies[2].ratio = parseFloat((this.configurations.find(a => a.id === 5)).value);
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
          sum: this.sum,
        })
          .then(() => {
            this.sum = 0;
            this.managerId = null;
            this.clientId = null;
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
