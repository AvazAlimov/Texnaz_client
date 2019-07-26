export const PriceCash = ({ secondPrice, mixPriceNonCash }, exRate) => (secondPrice
  - mixPriceNonCash / exRate);

export const B2C = (item, offRate, exRate) => (item.secondPrice * 1.2 * exRate);

export default (price, offRate, exRate) => ({
  firstPrice: B2C(price, offRate, exRate), // price.secondPrice * rate,
  secondPrice: price.secondPrice,
  mixPriceNonCash: price.mixPriceNonCash,
  mixPriceCash: PriceCash(price, exRate),
});

/*
export const B2C = (item, offRate, exRate) => ((item.mixPriceNonCash
    / offRate / 1.2 + PriceCash(item, exRate) * 1.12) * 1.2 * exRate);
*/
