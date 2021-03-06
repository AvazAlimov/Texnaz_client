<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            .border.white
                v-layout.pa-3
                  v-menu(
                    v-model="start"
                    :close-on-content-click="false"
                    min-width="290px"
                  ).ma-3
                    template(v-slot:activator="{ on }")
                      v-text-field(
                        readonly
                        v-on="on"
                        v-model="startDate"
                        label="От"
                      )
                    v-date-picker(
                      v-model="startDate"
                      @input="start = false"
                      :max="maximum"
                    )
                  v-menu(
                    v-model="end"
                    :close-on-content-click="false"
                    full-width
                    min-width="290px"
                  ).ma-3
                    template(v-slot:activator="{ on }")
                      v-text-field(
                        readonly
                        v-on="on"
                        v-model="endDate"
                        label="До"
                      )
                    v-date-picker(
                      v-model="endDate"
                      @input="end = false"
                      :max="maximum"
                    )
                  v-spacer
                  v-text-field(
                    v-model="search"
                    append-icon="search"
                    label="Поиск"
                  )
                v-data-table(
                    :headers="headers"
                    :loading="loading"
                    :items="returns"
                    :search="search"
                )
                    template(v-slot:items="{ item }")
                      td {{ item.date | moment('YYYY-MM-DD') }}
                      td {{ item.number }}
                      td {{ item.warehouse }}
                      td {{ item.clientIcc }}
                      td {{ item.clientName }}
                      td {{ item.manager }}
                      td {{ item.amount | roundUp | readable }}
                      td {{ item.type }}
                      td {{ item.form }}
                      td {{ item.clientBalance | roundUp | readable}}
                      td
                        v-btn.ma-0(
                          flat
                          icon
                          :to="{ name: 'returnInfo', params: { returnId: item.id } }"
                          color="secondary")
                          v-icon(small) edit
                v-divider
                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.mb-1.mr-1(
                    flat
                    color="secondary"
                    @click="submit()"
                    :loading="loading"
                    :disabled="errors.items.length > 0"
                  ) Завершить
</template>

<script>
import Return from '@/services/Return';
import Sale from '@/services/Sale';

export default {
  name: 'Return',
  data: () => ({
    loading: false,
    headers: [
      {
        text: 'Дата продажи',
        value: 'date',
        width: 1,
      },
      {
        text: 'Номер продажи',
        value: 'number',
        width: 1,
      },
      {
        text: 'Склад',
        value: 'warehouse',
      },
      {
        text: 'Клиент икк',
        value: 'clientIcc',
        width: 1,
      },
      {
        text: 'Клиент',
        value: 'clientName',
      },
      {
        text: 'Менеджер',
        value: 'manager',
        width: 1,
      },
      {
        text: 'Сумма продажи',
        value: 'amount',
        width: 1,
      },
      {
        text: 'Способ оплаты',
        value: 'type',
        width: 1,
      },
      {
        text: 'Тип расчета',
        value: 'form',
        width: 1,
      },
      {
        text: 'Баланс клиента',
        value: 'clientBalance',
        width: 1,
      },
      {
        sortable: false,
      },
    ],
    returns: [],
    search: '',
    startDate: (new Date()).toISOString().substring(0, 10),
    start: false,
    endDate: (new Date()).toISOString().substring(0, 10),
    maximum: (new Date()).toISOString().substring(0, 10),
    end: false,
  }),
  created() {
    this.getAll();
  },
  methods: {
    getAll() {
      this.loading = true;
      Sale.getByWarehouse(this.$route.params.id)
        .then((sales) => {
          this.returns = sales.filter(sale => !!sale.shipped
            && ((this.$hasRole(1)
            || this.$hasRole(6)) ? true : sale.managerId === this.$getUserId()))
            .map(sale => ({
              id: sale.id,
              date: sale.createdAt,
              number: sale.number,
              warehouse: sale.warehouse.name,
              clientIcc: sale.client.icc,
              clientName: sale.client.name,
              manager: sale.manager.name,
              amount: this.$getTotalPrice(sale, sale.exchangeRate, sale.officialRate),
              type: sale.type,
              form: sale.form,
              clientBalance: sale.client.balance,
            }));
        })
        .catch(err => this.$store.commit('setMessage', err.message))
        .finally(() => { this.loading = false; });
    },
    submit() {
      this.loading = true;
      Return.acceptMultiple(this.returns.filter(item => !!item.selected))
        .then(() => window.location.reload())
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
};
</script>
