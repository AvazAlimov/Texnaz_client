<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'batch_expanses' }")
            v-icon arrow_back
        .title Расходы по растаможке
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
                      //- .subheading.mb-1
                      //-     strong Курс доллара (обмен):
                      //-     |  {{ batch.exchange_rate }}
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
                        hide-actions
                    )
                        template(v-slot:items="props")
                            Item(:productId="props.item.id")
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
  name: 'CustomsExpanses',
  data() {
    return {
      loading: false,
      batch: {
        expanses: [],
      },
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
          // contract_price / packaging
          sortable: false,
        },
        {
          text: 'Цена таможенная за кг',
          value: 'customs_price_per_unit',
          // customs_price / packaging
          sortable: false,
        },
        {
          text: 'Акциз %',
          value: 'excise',
          sortable: false,
        },
        {
          text: 'Пошлина %',
          value: 'tax',
          sortable: false,
        },
        {
          text: 'НДС %',
          value: 'vat',
          sortable: false,
        },
        {
          text: 'Очистка %',
          value: 'cleaning',
          sortable: false,
        },
        {
          text: 'Размер Акциз %',
          value: 'excise_value',
          // (customs_price + transport_non_cash_per_unit) * excise
          sortable: false,
        },
        {
          text: 'Размер Пошлина %',
          value: 'tax_value',
          // (customs_price + transport_non_cash_per_unit) * tax
          sortable: false,
        },
        {
          text: 'Размер НДС %',
          value: 'vat_value',
          // (customs_price + transport_non_cash_per_unit + excise_value + tax_value) * vat
          sortable: false,
        },
        {
          text: 'Размер Очистка %',
          value: 'cleaning_value',
          // (customs_price + transport_non_cash_per_unit + excise_value + tax_value) * cleaning
          sortable: false,
        },
        // {
        //   text: 'Себестоимость БН',
        //   value: 'cost_price_non_cash',
        //   sortable: false,
        // },
        // {
        //   text: 'Рентабельность %',
        //   value: 'profitability_non_cash',
        //   sortable: false,
        // },
        // {
        //   text: 'Налог на прибыль',
        //   value: 'income_tax',
        //   sortable: false,
        // },
        // {
        //   text: 'Цена БН для списания',
        //   value: 'charge_price',
        //   sortable: false,
        // },
      ],
      products: [],
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
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
