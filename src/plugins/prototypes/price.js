export default (price, rate) => ({
  firstPrice: price.secondPrice * rate,
  secondPrice: price.secondPrice,
  mixPriceNonCash: price.mixPriceNonCash,
  mixPriceCash: price.secondPrice - price.mixPriceNonCash / rate,
});
