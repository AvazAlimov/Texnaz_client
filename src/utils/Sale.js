import { calculate } from './Payment';
import Client from '@/services/Client';

export default (clientId, salePrice, rate) => new Promise((res, rej) => {
  Client.get(clientId)
    .then((client) => {
      if (client.balance > 0) {
        calculate(clientId, 0, client.balance, rate);
        res();
      }
      if (client.balance < salePrice) {
        Client.addBalance(clientId,
          0 - (Number.parseFloat(salePrice) / rate))
          .then(() => { res(); })
          .catch(err => rej(err));
      }
    })
    .catch(error => rej(error));
});
