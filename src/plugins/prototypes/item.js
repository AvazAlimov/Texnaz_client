// // Размер акциза
// function exciseValue(item) {
//     return parseFloat(item.customs_price)
//             / item.product.packing
//             * (item.excise / 100);
// }

// // Размер пошлины
// function taxValue(item) {
//     return parseFloat(item.customs_price)
//             / item.product.packing
//             * (item.tax / 100);
// }

// // Размер очистки
// function cleaningValue(item, batch) {
//     return (parseFloat(this.item.customs_price)
//             / item.product.packing
//             + exciseValue(item)
//             + taxValue(item)
//             + batch.transportExpansesPerUnitNonCash)
//             * (item.cleaning / 100);
// }

// // Себестоимость БН
// function costPriceNonCash(item, batch) {
//     return (batch.transportExpansesPerUnitNonCash
//             + parseFloat(item.customs_price)
//             / item.product.packing
//             + exciseValue(item)
//             + taxValue(item)
//             + cleaningValue(item, batch));
// }

// // Размер рентабельности (бн)
// function nonCashProfitabilityValue(item, batch) {
//     return (costPriceNonCash(item, batch)
//             + batch.transportExpansesNonCash
//             + batch.periodExpansesNonCashPerUnit)
//             * (parseFloat(item.non_cash_profitability) / 100);
// }

// // Размер налога на прибыль
// function incomeTaxValue(item, batch) {
//     return parseFloat(nonCashProfitabilityValue(item, batch) * item.income_tax / 100);
// }

// // Цена БН для списания
// function firstCost(item, batch) {
//     return (costPriceNonCash(item, batch)
//             + batch.transportExpansesNonCash
//             + batch.periodExpansesNonCashPerUnit
//             + nonCashProfitabilityValue(item, batch)
//             + incomeTaxValue(item, batch))
//             * (1 + item.vat / 100);
// }

// // Себестоимость Н
// function costPriceCash(item) {
//     return (item.contract_price
//             - item.customs_price)
//             / item.product.packing;
// }

// // Рентабельность
// cashProfitabilityValue(item, batch) {
// return (costPriceCash(item)
//             + batch.transport_expanses_per_unit_cash
//             + batch.period_expanses_cash_per_unit)
//             * (parseFloat(this.item.cash_profitability) / 100);
// },
// // Цена Н для расчетов
// secondCost() {
// return this.costPriceCash
//             + this.period_expanses_cash_per_unit
//             + this.transport_expanses_per_unit_cash
//             + this.transport_expanses_cash
//             + this.cashProfitabilityValue;
// },
// // Цена №1
// firstPrice() {
// const value = Math.ceil((((this.mixPriceNonCash
//             / (1 + this.item.vat / 100))
//             + (this.mixPriceCash
//                 * (1 + this.item.income_tax / 100)
//                 * this.batch.market_rate))
//             * (1 + this.item.vat / 100)) / 100) * 100;
// // eslint-disable-next-line vue/no-side-effects-in-computed-properties
// this.item.firstPrice = value;
// return value;
// },
// // Цена №2
// mixPriceCash() {
// const value = Math.ceil((this.secondCost * this.item.product.packing) * 100) / 100;
// // eslint-disable-next-line vue/no-side-effects-in-computed-properties
// this.item.mixPriceCash = value;
// return value;
// },
// mixPriceNonCash() {
// const value = Math.ceil(
//     (this.firstCost * this.batch.official_rate * this.item.product.packing) / 100,
// ) * 100;
// // eslint-disable-next-line vue/no-side-effects-in-computed-properties
// this.priceOne = value;
// return value;
// },
// // Цена №3
// secondPrice() {
// const value = Math.ceil(((this.secondCost
//             + this.firstCost)
//             * this.item.product.packing) * 100) / 100;
// // eslint-disable-next-line vue/no-side-effects-in-computed-properties
// this.priceTwo = value;
// return value;
// },

// // Changes in Price
// mixPriceNonCashChange() {
// if (this.item.product.prices.length) {
//     return (((this.priceOne / this.item.product.prices[0].mixPriceNonCash) - 1) * 100);
// }
// return 0;
// },
// secondPriceChange() {
// if (this.item.product.prices.length) {
//     return (((this.priceTwo / this.item.product.prices[0].secondPrice) - 1) * 100);
// }
// return 0;
// },

// export default (item, batch) => {

// };
