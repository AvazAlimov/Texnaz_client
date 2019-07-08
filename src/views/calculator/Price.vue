<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      Info(:batch="batch" :step="5")
      v-divider
      v-layout.pt-3(wrap row)
        v-text-field.mx-4(
          v-model="incomeTax"
          label="Налог на прибыль %"
          @input="applyToAll('income_tax', incomeTax)"
          color="secondary"
        )
        v-text-field.mx-4(
          v-model="nonCashProfitability"
          label="Рентабельность (БН) %"
          @input="applyToAll('non_cash_profitability', nonCashProfitability)"
          color="secondary"
        )
        v-text-field.mx-4(
          v-model="cashProfitability"
          label="Рентабельность (Н) %"
          @input="applyToAll('cash_profitability', cashProfitability)"
          color="secondary"
        )
      v-divider
      v-data-table(
        :headers="headers"
        :items="items"
        no-data-text="Ничего не выбрано"
        fixed-headers
        hide-actions)
        template(v-slot:items="props")
          PriceItem(:item="props.item" :batch="batch")
      v-divider
      v-layout(wrap row justify-end)
        v-menu(offset-y)
          template(v-slot:activator="{ on }")
            v-btn.ma-0.mb-1.mr-1(
              color="secondary" flat v-on="on" :disabled="errors.items.length > 0"
            ) Утвердить
          v-list
            v-list-tile(@click="approve(false)")
              v-list-tile-title Обновить цену
            v-list-tile(@click="approve(true)")
              v-list-tile-title Обновить цену и добавить в склад
        v-btn.ma-0.mb-1.mr-1(flat color="secondary" @click="print") Распечатать
</template>

<script>
import Batch from '@/services/Batch';
import Export from '@/utils/Export';
import PreStock from '@/services/PreStock';
import Price from '@/services/Price';

export default {
  name: 'Price',
  data() {
    return {
      loading: false,
      batch: {
        expanses: [],
        items: [],
      },
      items: [],
      incomeTax: 0,
      cashProfitability: 0,
      nonCashProfitability: 0,
    };
  },
  computed: {
    headers() {
      const columns = [
        {
          text: 'Бренд',
          value: 'product.Brand.name',
        },
        {
          text: 'Производитель',
          value: 'product.Brand.manufacturer',
        },
        {
          text: 'Наименование',
          value: 'product.name',
        },
        {
          text: 'Фасовка',
          value: 'product.packing',
        },
        {
          text: 'Цвет',
          value: 'color',
        },
        {
          text: 'Количество',
          value: 'quantity',
        },
        {
          text: 'Наценка (сум)',
          sortable: false,
        },
        {
          text: 'B2B ($)',
          sortable: false,
        },
      ];
      if (this.batch.Warehouse) {
        columns.splice(6, 0, {
          text: 'Экспорт в склад',
          sortable: false,
        });
      }
      return columns;
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
    applyToAll(name, value) {
      this.items.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item[name] = value;
      });
    },
    approve(createPrestock) {
      const preStocks = [];
      this.batch.approved = true;

      if (this.batch.Warehouse && createPrestock) {
        this.items.forEach((item) => {
          preStocks.push({
            productId: item.product.id,
            warehouseId: this.batch.warehouse,
            quantity: item.export,
          });
        });
      }

      Promise.all([
        createPrestock ? PreStock.createMultiple(preStocks) : null,
        Price.createMultiple(this.items.map(item => ({
          productId: item.product.id,
          firstPrice: item.firstPrice || 0,
          mixPriceNonCash: item.mixPriceNonCash,
          mixPriceCash: item.mixPriceCash || 0,
          secondPrice: item.secondPrice,
        }))),
        Batch.update(this.batch.id, this.batch),
      ])
        .then(() => {
          this.$router.push({ name: 'calculator' });
          window.location.reload();
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        });
    },
    print() {
      const jsonData = this.items.map(item => ({
        name: item.product.name,
        packing: item.product.packing,
        firstPrice: item.firstPrice,
        mixPriceNonCash: item.mixPriceNonCash,
        mixPriceCash: item.mixPriceCash,
        secondPrice: item.secondPrice,
      }));
      Export.priceToExcel(jsonData, 'Цены');
    },
  },
  created() {
    this.getAll();
  },
};
</script>
