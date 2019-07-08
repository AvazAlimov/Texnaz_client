// Общий вес
function totalWeight(batch) {
  let total = 0;
  batch.items.forEach((element) => {
    total += element.product.packing * element.quantity;
  });
  return total;
}

// Расходы периода (н)
function periodExpansesCash(batch) {
  let total = 0;
  batch.expanses.forEach((expanse) => {
    if (!expanse.is_transport && expanse.is_cash) total += expanse.value;
  });
  return ((total / batch.total) * 100) > 2 ? ((total / batch.total) * 100) : 2;
}

// Расходы периода (бн)
function periodExpansesNonCash(batch) {
  let total = 0;
  batch.expanses.forEach((expanse) => {
    if (!expanse.is_transport && !expanse.is_cash) total += expanse.value;
  });
  return ((total / batch.total) * 100) > 4 ? ((total / batch.total) * 100) : 4;
}

// Затраты на поставку (н)
function transportExpansesCash(batch) {
  let total = 0;
  batch.expanses.forEach((expanse) => {
    if (expanse.is_transport && expanse.is_cash) total += expanse.value;
  });
  return total / batch.market_rate;
}
// Затраты на поставку (бн)
function transportExpansesNonCash(batch) {
  let total = 0;
  batch.expanses.forEach((expanse) => {
    if (expanse.is_transport && !expanse.is_cash) total += expanse.value;
  });
  return total / batch.official_rate;
}

// Транспорт Н за кг
function transportExpansesPerUnitCash(batch) {
  return batch.transport_cash / totalWeight(batch);
}

// Транспорт БН за кг
function transportExpansesPerUnitNonCash(batch) {
  return batch.transport_non_cash / totalWeight(batch);
}

// Цена таможенная
function customsPrice(batch) {
  let total = 0;
  batch.items.forEach((item) => { total += item.customs_price * item.quantity; });
  return total;
}

// Цена контрактная
function contractPrice(batch) {
  let total = 0;
  batch.items.forEach((item) => { total += item.contract_price * item.quantity; });
  return total;
}

// Конвертация
function conversion(batch) {
  return batch.official_rate
              * customsPrice(batch)
              * batch.conversion / 100;
}

// Затраты на банк
function bankTransfer(batch) {
  return batch.exchange_rate
              * (contractPrice(batch) - customsPrice(batch))
              * batch.bank_transfer / 100;
}

export default batch => ({
  conversion: conversion(batch),
  bankTransfer: bankTransfer(batch),
  periodExpansesCash: periodExpansesCash(batch),
  periodExpansesNonCash: periodExpansesNonCash(batch),
  transportExpansesCash: transportExpansesCash(batch),
  transportExpansesNonCash: transportExpansesNonCash(batch),
  transportExpansesPerUnitCash: transportExpansesPerUnitCash(batch),
  transportExpansesPerUnitNonCash: transportExpansesPerUnitNonCash(batch),
});
