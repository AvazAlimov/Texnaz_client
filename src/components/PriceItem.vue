<template lang="pug">
    tr
      td {{ item.product.name }}
      td {{ item.product.packing }}
      td {{ item.product.color }}
      td.blue.lighten-4 {{ firstPrice | roundUp }} сум
      td.orange.lighten-4 {{ firstCost | roundUp }} сум
      td.orange.lighten-4 {{ secondCost | roundUp }} $
      td.green.lighten-4 {{ secondPrice | roundUp }} $
</template>

<script>
/* eslint-disable no-param-reassign */
export default {
  name: 'Item',
  props: {
    item: {
      required: true,
    },
    batch: {
      required: true,
    },
  },
  computed: {
    // Общий вес
    totalWeight() {
      let sum = 0;
      this.batch.items.forEach((element) => {
        sum += element.product.packing * element.quantity;
      });
      return sum;
    },
    // Транспорт Н за кг
    transport_expanses_per_unit_cash() {
      return this.batch.transport_cash / this.totalWeight;
    },
    // Транспорт БН за кг
    transport_expanses_per_unit_non_cash() {
      return this.batch.transport_non_cash / this.totalWeight;
    },
    // Расходы периода (бн)
    period_expanses_non_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return ((sum / this.batch.total) * 100) > 4 ? ((sum / this.batch.total) * 100) : 4;
    },
    // Расходы периода (н)
    period_expanses_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && expanse.is_cash) sum += expanse.value;
      });
      return ((sum / this.batch.total) * 100) > 2 ? ((sum / this.batch.total) * 100) : 2;
    },
    // Размер акциза
    exciseValue() {
      return parseFloat(this.item.customs_price / this.item.product.packing)
              * (this.item.excise / 100);
    },
    // Размер пошлины
    taxValue() {
      return parseFloat(this.item.customs_price / this.item.product.packing)
              * (this.item.tax / 100);
    },
    // Размер НДС
    vatValue() {
      return (parseFloat(this.item.customs_price) / this.item.product.packing
              + this.exciseValue
              + this.taxValue
              + this.transport_expanses_per_unit_non_cash)
              * (this.item.vat / 100);
    },
    // Размер очистки
    cleaningValue() {
      return (parseFloat(this.item.customs_price / this.item.product.packing)
              + this.exciseValue
              + this.taxValue
              + this.transport_expanses_per_unit_non_cash)
              * (this.item.cleaning / 100);
    },
    // Себестоимость БН
    costPriceNonCash() {
      return (this.transport_expanses_per_unit_non_cash
              + parseFloat(this.item.customs_price / this.item.product.packing)
              + this.exciseValue
              + this.taxValue
              + this.cleaningValue);
    },
    // Затраты на поставку (бн)
    delivery_expanses_non_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return sum / this.batch.official_rate / this.totalWeight;
    },
    // Размер рентабельности
    profitabilityValue() {
      return (parseFloat(this.costPriceNonCash)
              + parseFloat(this.delivery_expanses_non_cash))
              * (1 + (parseFloat(this.period_expanses_non_cash) / 100))
              * (parseFloat(this.item.non_cash_profitability) / 100);
    },
    // Размер налога на прибыль
    incomeTaxValue() {
      return parseFloat(this.profitabilityValue * this.item.income_tax / 100);
    },
    // Цена БН для списания
    firstCost() {
      const value = (parseFloat(this.costPriceNonCash)
                    + parseFloat(this.profitabilityValue)
                    + parseFloat(this.incomeTaxValue))
                    * (1 + this.item.vat / 100)
                    * this.batch.official_rate * this.item.product.packing;
      return Math.ceil(value / 100) * 100;
    },
    // Затраты на поставку (н)
    delivery_expanses_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && expanse.is_cash) sum += expanse.value;
      });
      return sum / this.batch.market_rate / this.totalWeight;
    },
    // Себестоимость Н
    costPriceCash() {
      return (parseFloat(this.item.contract_price)
              - parseFloat(this.item.customs_price)) / this.item.product.packing;
    },
    // Рентабельность
    cashProfitabilityValue() {
      return (parseFloat(this.costPriceCash)
              + parseFloat(this.delivery_expanses_cash))
              * (1 + (parseFloat(this.period_expanses_cash) / 100))
              * (parseFloat(this.item.cash_profitability) / 100);
    },
    // Цена Н для расчетов
    secondCost() {
      return (this.costPriceCash
              + this.transport_expanses_per_unit_cash
              + this.delivery_expanses_cash
              + this.cashProfitabilityValue) * this.item.product.packing;
    },
    // Цена №1
    firstPrice() {
      return Math.ceil((this.firstCost + this.secondCost * this.batch.official_rate) / 100) * 100;
    },
    // Цена №3
    secondPrice() {
      return this.secondCost + this.firstCost / this.batch.market_rate;
    },
  },
};
</script>
