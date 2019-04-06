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
                SearchProduct(v-model="product")
            v-flex(xs12)
                .border.white
                    .title.pa-4 Выбранные товары: {{ items.length }}
                    v-divider
                    v-data-table(
                        :headers="headers"
                        :items="items"
                        no-data-text="Ничего не выбрано"
                        hide-actions)
                        template(v-slot:items="props")
                            SelectionItem(:item="props.item" :remove="remove")
            v-flex(xs12)
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary"
                      :disabled="errors.items.length > 0"
                      :loading="loading"
                      @click="submit") Завершить
</template>

<script>
/* eslint-disable no-param-reassign */
import Batch from '@/services/Batch';
import Item from '@/services/Item';

export default {
  name: 'Selection',
  data() {
    return {
      loading: false,
      product: null,
      items: [],
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
          width: 100,
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
        this.batch.items.forEach((item) => {
          this.items.push(item);
        });
      });
    },
    remove(productId) {
      const item = this.items.find(element => element.productId === productId);
      this.items.splice(this.items.indexOf(item), 1);
    },
    submit() {
      this.loading = true;
      const tasks = [];
      const ids = [];
      this.items.forEach((item) => {
        if (!item.id) {
          tasks.push(Item.create(item));
        } else {
          ids.push(item.id);
          tasks.push(Item.update(item.id, item));
        }
      });
      this.batch.items.forEach((item) => {
        if (!ids.includes(item.id)) {
          tasks.push(Item.delete(item.id));
        }
      });
      Promise.all(tasks)
        .then(() => { this.$router.push({ name: 'customs_expanses' }); })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
  },
  watch: {
    product(product) {
      if (product) {
        const ids = this.items.map(item => item.product.id);
        if (!ids.includes(product.id)) {
          const item = { product, batchId: this.batch.id, productId: product.id };
          this.items.push(item);
        }
      }
      this.product = null;
    },
  },
  created() {
    this.getAll();
  },
};
</script>
