<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            .border.white
                v-layout(wrap).pa-3
                  v-menu(
                    v-model="start"
                    :clost-on-content-click="false"
                    min-width="290px"
                  ).ma-3
                    template(v-slot:activator="{ on }")
                      v-text-field(
                        v-model="startDate"
                        v-on="on"
                        label="От"
                        readonly
                      )
                    v-date-picker(
                      v-model="startDate"
                      @input="start = !start"
                      :max="maximum"
                    )
                  v-menu(
                    v-model="end"
                    :clost-on-content-click="false"
                    min-width="290px"
                  ).ma-3
                    template(v-slot:activator="{ on }")
                      v-text-field(
                        v-model="endDate"
                        v-on="on"
                        label="До"
                        readonly
                      )
                    v-date-picker(
                      v-model="endDate"
                      @input="end = !end"
                      :max="maximum"
                    )
                  v-spacer
                  v-text-field(
                    v-model="search"
                    label="Поиск"
                    append-icon="search"
                  )
                v-data-table(
                    :headers="headers"
                    :items="filteredData"
                )
                    template(v-slot:items ="{ item }")
                        td {{ item.territory }}
                        td {{ item.province }}
                        td {{ item.date | moment('YYYY-MM-DD HH-mm') }}
                        td {{ item.number }}
                        td {{ item.warehouse }}
                        td {{ item.icc }}
                        td {{ item.clientname }}
                        td {{ item.managername }}
                        td {{ types.find(el => el.id === item.type).name }}
                        td {{ forms.find(el => el.id === item.form).name }}
                        td {{ item.returnPrice | roundUp | readable }}
                        td {{ item.balance | roundUp | readable}}

</template>

<script>
import Sale from '@/services/Sale';
import ReturnClient from '@/services/ReturnClient';
import ShipmentTypes from '@/assets/shipment_types.json';
import ShipmentPayments from '@/assets/shipment_payments.json';
import Territory from '@/services/Territory';

export default {
  data: () => ({
    start: false,
    end: false,
    startDate: (new Date()).toISOString().substring(0, 10),
    endDate: (new Date()).toISOString().substring(0, 10),
    maximum: (new Date()).toISOString().substring(0, 10),
    search: '',
    items: [],
    types: ShipmentTypes,
    forms: ShipmentPayments,
  }),
  computed: {
    headers() {
      return [
        {
          text: 'Tерритория',
          value: 'territory',
        },
        {
          text: 'Область',
          value: 'province',
        },
        {
          text: 'Дата возвращения',
          value: 'date',
        },
        {
          text: 'Номер',
          value: 'number',
        },
        {
          text: 'Склады',
          value: 'warehouse',
        },
        {
          text: 'Икк',
          value: 'icc',
        },
        {
          text: 'Kлиент',
          value: 'clientname',
        },
        {
          text: 'Менеджер',
          value: 'managername',
        },
        {
          text: 'Способ оплаты',
          value: 'type',
        },
        {
          text: 'Тип расчета',
          value: 'form',
        },
        {
          text: `Сумма возврата ($${this.readable(this.filteredData.map(el => el.returnPrice).reduce((a, b) => a + b, 0))})`,
          value: 'returnPrice',
        },
        {
          text: 'Баланс клиента',
          value: 'balance',
        },
      ];
    },
    filteredData() {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 59);
      return this.items.filter(el => new Date(el.date).getTime() >= start.getTime()
        && new Date(el.date).getTime() <= end.getTime()
        && ((el.number.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.warehouse.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.territory.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.province.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.icc.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.date.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.clientname.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.managername.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.returnPrice.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.balance.toString().toLowerCase()).includes(this.search.toLowerCase())));
    },
  },
  methods: {
    readable(value) {
      return this.$options.filters.readable(this.$options.filters.roundUp(value));
    },
    getAll() {
      Promise.all([
        ReturnClient.getAll(),
        Sale.getAll(),
        Territory.getAll(),
      ])
        .then((result) => {
          this.items.push(...result[0].map(item => ({
            date: item.createdAt,
            number: item.number,
            warehouse: item.warehouse.name,
            icc: item.client.icc,
            clientname: item.client.name,
            managername: item.manager.name,
            type: item.type,
            form: item.form,
            returnPrice: this.$getTotalPrice(item, item.exchangeRate, item.officialRate),
            balance: this.$getClientBalance(item.client, result[1]
              .filter(el => el.clientId === item.clientId)),
            territory: result[2].find(element => element.provinces
              .map(province => province.id).includes(item.client.provinceId)).name,
            province: item.client.province.name,
          })));
        })
        .catch((err) => { this.$store.commit('setMessage', err.message); });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>
