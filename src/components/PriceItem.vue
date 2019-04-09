<template lang="pug">
    tr
      td {{ item.product.name }}
      td {{ item.product.packing }}
      td {{ item.product.color }}
      td.blue {{ firstPrice | roundUp }} сум
      td.orange {{ firstCost | roundUp }} сум
      td.orange {{ secondCost | roundUp }} $
      td.green {{ secondPrice | roundUp }} $
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
    // Размер акциза
    exciseValue() {
      return parseFloat(this.item.customs_price)
              * (this.item.excise / 100);
    },
    // Размер пошлины
    taxValue() {
      return parseFloat(this.item.customs_price)
              * (this.item.tax / 100);
    },
    // Размер НДС
    vatValue() {
      return (parseFloat(this.item.customs_price)
              + this.exciseValue
              + this.taxValue
              + this.transport_expanses_per_unit_non_cash)
              * (this.item.vat / 100);
    },
    // Размер очистки
    cleaningValue() {
      return (parseFloat(this.item.customs_price)
              + this.exciseValue
              + this.taxValue
              + this.transport_expanses_per_unit_non_cash)
              * (this.item.cleaning / 100);
    },
    // Себестоимость БН
    costPriceNonCash() {
      return (this.transport_expanses_per_unit_non_cash
              + parseFloat(this.item.customs_price)
              + this.exciseValue
              + this.taxValue
              + this.cleaningValue);
    },
    // Расходы периода (бн)
    period_expanses_non_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return ((sum / this.batch.total) * 100) > 4 ? ((sum / this.batch.total) * 100) : 4;
    },
    // Затраты на поставку (бн)
    transport_expanses_non_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return sum / this.batch.official_rate / this.totalWeight;
    },
    // Размер рентабельности
    profitabilityValue() {
      return (parseFloat(this.costPriceNonCash)
              + parseFloat(this.transport_expanses_non_cash))
              * (parseFloat(this.item.cash_profitability) / 100)
              * (1 + (parseFloat(this.period_expanses_non_cash) / 100));
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
                    * this.batch.market_rate;
      return Math.ceil(value / 100) * 100;
    },
    // Затраты на поставку (н)
    transport_expanses_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && expanse.is_cash) sum += expanse.value;
      });
      return sum / this.batch.market_rate;
    },
    // Себестоимость Н
    costPriceCash() {
      return parseFloat(this.item.contract_price)
              - parseFloat(this.item.customs_price);
    },
    // Рентабельность
    nonCashProfitabilityValue() {
      return (parseFloat(this.costPriceCash)
              + parseFloat(this.transport_expanses_cash))
              * (parseFloat(this.item.non_cash_profitability) / 100)
              * (1 + (parseFloat(this.period_expanses_non_cash) / 100));
    },
    // Цена Н для расчетов
    secondCost() {
      return this.costPriceCash
              + this.transport_expanses_per_unit_cash
              + this.transport_expanses_cash
              + this.nonCashProfitabilityValue;
    },
    // Цена №1
    firstPrice() {
      return Math.ceil((this.firstCost + this.secondCost * this.batch.official_rate) / 100) * 100;
    },
    // Цена №2
    secondPrice() {
      return this.secondCost + this.firstCost / this.batch.market_rate;
    },
  },
};
</script>
