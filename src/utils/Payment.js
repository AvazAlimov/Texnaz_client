import Sale from '@/services/Sale';
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

/**
 * @param {Client id} clientId
 * @param {Payment type} type
 * @param {Payment value} value
 * @param {Rate for converting} rate
 */
export async function calculate(clientId, type, value, rate) {
  await Sale.getByClient(clientId)
    .then(async (sales) => {
      let paymentValue = Number.parseFloat(value) || 0;
      await sales.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)).forEach(async (sale) => {
        if (paymentValue > 0) {
        //  payment respect currency
          let payment = paymentRespectCurrency(paymentValue, type, sale.type, rate);
          const tasks = [];
          // payment for each sale product
          sale.items.forEach((saleItem) => {
            if (payment > 0) {
              console.log(Number.parseFloat(saleItem.paidPrice) + Number.parseFloat(payment));
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

          // check is there residue of the payment
          paymentValue = payment > 0 ? currencyRespectPayment(payment, type, sale.type, rate) : 0;

          await Promise.all(tasks)
            .then(() => {
            // check whether all products payed, if yeah then update sale status to Closed
              Sale.getByClient(clientId).then((newSales) => {
                newSales.forEach(async (newSale) => {
                  // eslint-disable-next-line max-len
                  if (!newSale.items.filter(({ debtPrice }) => debtPrice !== 0).length) {
                  // UPDATE sale status closed
                    await Sale.close(newSale.id);
                  }
                });
              });
            })
            .catch(err => console.error(err));
        }
      });

      if (paymentValue > 0) {
        // UPDATE client balance
        Client.addBalance(clientId, type === 0 ? paymentValue : paymentValue * rate);
      }
    }).catch((error) => { console.error(error); });
}
