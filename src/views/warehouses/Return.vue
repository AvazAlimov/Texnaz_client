<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            .border.white
                v-data-table(
                    :headers="headers"
                    :loading="loading"
                    :items="returns"
                    hide-actions
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
  }),
  created() {
    this.getAll();
  },
  methods: {
    getAll() {
      this.loading = true;
      Sale.getAll()
        .then((sales) => {
          this.returns = sales.filter(sale => !!sale.shipped)
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
              clientBalance: this.$getClientBalance(sale.client),
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
