import Sale from '@/services/Sale';
import Payment from '@/services/Payment';
import Client from '@/services/Client';

export function paymentRespectCurrency(payment, paymentType, saleType, rate) {
  switch (saleType) {
    // if sale product price type is B2C
    case 1:
      // if payment is $ then return respect converted SUM, else return itself
      return paymentType === 0 ? payment * rate : payment;
    case 3:
      // if payment is $ then return itself, else convert it to respect $ value
      return paymentType === 0 ? payment : payment / rate;
    default:
      return 0;
  }
}

export function currencyRespectPayment(payment, paymentType, saleType, rate) {
  switch (saleType) {
    // if sale product price type is B2C
    case 1:
      return paymentType === 0 ? payment / rate : payment;
    case 3:
      // if payment is $ then return itself, else convert it to respect $ value
      return paymentType === 0 ? payment : payment * rate;
    default:
      return 0;
  }
}

function paymentUpdateBalance(paymentId, clientId, value) {
  return [
    Client.addBalance(clientId, value),
    Payment.updateCurrentBalance(paymentId, value),
  ];
}

/**
 * @param {Client id} clientId
 * @param {Payment type} type
 * @param {Payment value} value
 * @param {Rate for converting} rate
 */
// eslint-disable-next-line max-len
export const calculate = (clientId, type, value, rate, paymentId = 0) => new Promise((resolve, reject) => {
  // UPDATE client balance
  Promise.all([
    Sale.getByClient(clientId),
    paymentId ? paymentUpdateBalance(paymentId, clientId, type === 0 ? value : value / rate)
      : Client.addBalance(clientId, 0),
  ])
    .then((result) => {
      const [sales] = result;
      let paymentValue = Number.parseFloat(value) || 0;

      sales.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)).forEach(async (sale) => {
        if (paymentValue > 0) {
          //  payment respect currency
          let payment = paymentRespectCurrency(paymentValue, type, sale.type, rate);
          const tasks = [];
          // payment for each sale product
          sale.items.forEach((saleItem) => {
            if (payment > 0) {
              // debtPrice > 0 means product is not paid fully
              if (saleItem.debtPrice > 0) {
                if (saleItem.debtPrice > (Number.parseFloat(saleItem.paidPrice)
                  + Number.parseFloat(payment))) {
                  // UPDATE paidPrice with (saleItem.paidPrice + payment)
                  tasks.push(Sale.updateSaleItem(saleItem.id, {
                    paidPrice: Number.parseFloat(saleItem.paidPrice) + Number.parseFloat(payment),
                  }));
                  payment = 0;
                } else if (payment !== 0) {
                  // UPDATE debtPrice and paidPrice are equal now
                  payment = (Number.parseFloat(saleItem.paidPrice)
                    + Number.parseFloat(payment)) - Number.parseFloat(saleItem.debtPrice);
                  tasks.push(Sale.updateSaleItem(saleItem.id, {
                    paidPrice: saleItem.debtPrice,
                    debtPrice: 0,
                  }));
                }
              }
            }
          });

          paymentValue = payment > 0 ? currencyRespectPayment(payment, type, sale.type, rate) : 0;

          await Promise.all(tasks)
            .then(() => {
              // check whether all products payed, if yeah then update sale status to Closed
              Sale.check(clientId);
            })
            .catch(err => reject(err));
        }
      });
      resolve();
    }).catch((error) => { reject(error); });
});
