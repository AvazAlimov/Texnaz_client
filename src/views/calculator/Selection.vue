<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'batch_expanses' }")
            v-icon arrow_back
        .title Выборка
        v-spacer
        .title 3/6
        v-flex(xs12)
        v-layout(row wrap)
            v-flex(xs6 d-flex)
                .border.pa-4.white
                    .subheading.mb-1
                        strong Название партии:
                        |  {{ batch.name }}
                    .subheading.mb-1
                        strong Номер партии:
                        |  {{ batch.number }}
                    .subheading.mb-1
                        strong Дата прибытия:
                        |  {{ batch.date ? batch.date.substring(0, 10) : '-' }}
                    .subheading.mb-1
                        strong Склад:
                        |  {{ batch.Warehouse ? batch.Warehouse.name : '-' }}
            v-flex(xs6 d-flex)
                .border.pa-4.white
                  v-layout(row wrap)
                    v-flex(xs6)
                      .subheading.mb-1
                          strong Транспорт (Н):
                          |  {{ batch.transport_cash }} $
                      .subheading.mb-1
                          strong Транспорт (БН):
                          |  {{ batch.transport_non_cash }} $
                    v-flex(xs6)
                      .subheading.mb-1
                        strong Затраты на поставку (н):
                        |  {{ transport_cash_expanses_rate }}
                      .subheading.mb-1
                        strong Затраты на поставку (бн):
                        |  {{ transport_non_cash_expanses_rate }}
                    v-flex(xs6)
                      .subheading.mb-1
                          strong Конвертация:
                          |  {{ batch.conversion }} %
                      .subheading.mb-1
                          strong Банковский перевод:
                          |  {{ batch.bank_transfer }} %
                    v-flex(xs6)
                      .subheading.mb-1
                          strong Курс доллара (рыночный):
                          |  {{ batch.market_rate }}
                      .subheading.mb-1
                          strong Курс доллара (официальный):
                          |  {{ batch.official_rate }}
                    v-flex(xs12)
                      v-divider.my-2
                      .subheading.mb-1
                          strong Общий оборот:
                          |  {{ batch.total }}
                      .subheading.mb-1
                          strong Расходы периода (н):
                          |  {{ cash_expanses_rate }} %
                      .subheading.mb-1
                          strong Расходы периода (бн):
                          |  {{ non_cash_expanses_rate }} %
            v-flex(xs12)
                .border.white.pa-4
                    .title Выбранные товары: {{ products.length }}
                    v-data-table(
                        :headers="headers"
                        :items="products"
                        no-data-text="Ничего не выбрано"
                        hide-actions)
                        template(v-slot:items="props")
                            SelectionItem(:productId="props.item.productId" :batch="batch")
            v-flex(xs12)
                SearchProduct(v-model="products")
            v-flex(xs12)
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary" :loading="loading") Завершить
</template>

<script>
import Batch from '@/services/Batch';

export default {
  name: 'Selection',
  data() {
    return {
      loading: false,
      batch: {
        expanses: [],
      },
      products: [],
      headers: [
        {
          text: 'Наименование',
          value: 'name',
          sortable: false,
        },
        {
          text: 'Фасовка',
          value: 'packing',
          sortable: false,
        },
        {
          text: 'Цвет',
          value: 'color',
          sortable: false,
        },
        {
          text: 'Количество',
          value: 'quantity',
          sortable: false,
        },
        {
          text: 'Вес',
          value: 'weight',
          sortable: false,
        },
        {
          text: 'Цена контрактная за фасовку',
          value: 'contract_price',
          sortable: false,
        },
        {
          text: 'Цена таможенная за фасовку',
          value: 'customs_price',
          sortable: false,
        },
        {
          text: 'Цена контрактная за кг',
          value: 'contract_price_per_unit',
          sortable: false,
        },
        {
          text: 'Цена таможенная за кг',
          value: 'customs_price_per_unit',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    cash_expanses_rate() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && expanse.is_cash) sum += expanse.value;
      });
      return (sum / this.batch.total) * 100 > 2 ? ((sum / this.batch.total) * 100).toFixed(2) : 2;
    },
    non_cash_expanses_rate() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return (sum / this.batch.total) * 100 > 4 ? ((sum / this.batch.total) * 100).toFixed(2) : 4;
    },
    transport_cash_expanses_rate() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && expanse.is_cash) sum += expanse.value;
      });
      return (sum / this.batch.market_rate).toFixed(2);
    },
    transport_non_cash_expanses_rate() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return (sum / this.batch.official_rate).toFixed(2);
    },
  },
  methods: {
    getAll() {
      Promise.all([
        Batch.get(this.$route.params.id),
      ]).then((results) => {
        [this.batch] = results;
        this.items.forEach((item) => {
          this.products.push(item);
        });
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
