<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'selection' }")
            v-icon arrow_back
        .title Расходы по растаможке
        v-spacer
        .title 4/6
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
                .border.white
                    .title.pa-4 Товары
                    v-data-table(
                        :headers="headers"
                        :items="items"
                        no-data-text="Ничего не выбрано"
                        hide-actions)
                        template(v-slot:items="props")
                            CustomsItem(:item="props.item" :batch="batch")
            v-flex(xs12)
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary"
                      :loading="loading"
                      :disabled="errors.items.length > 0"
                      @click="submit") Завершить
</template>

<script>
import Batch from '@/services/Batch';
import Item from '@/services/Item';

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
          text: 'Вес',
          value: 'weight',
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
          text: 'Размер акциза',
          value: 'excise_value',
          sortable: false,
        },
        {
          text: 'Размер пошлины',
          value: 'tax_value',
          sortable: false,
        },
        {
          text: 'Размер НДС',
          value: 'vat_value',
          sortable: false,
        },
        {
          text: 'Размер очистки',
          value: 'cleaning_value',
          sortable: false,
        },
        {
          text: 'Итого',
          value: 'cost_price_non_cash',
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
      items: [],
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
        this.batch.items.forEach((item) => {
          this.items.push(item);
        });
      });
    },
    submit() {
      this.loading = true;
      const tasks = [];
      this.items.forEach((item) => {
        tasks.push(Item.update(item.id, item));
      });
      Promise.all(tasks)
        .then(() => { this.$router.push({ name: 'first_cost' }); })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
