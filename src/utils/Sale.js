import { calculate } from './Payment';
import Sale from '@/services/Sale';
import Client from '@/services/Client';

export default (clientId, price, rate) => new Promise((res, rej) => {
  Client.get(clientId)
    .then((client) => {
      Client.addBalance(clientId, 0 - price)
        .then(() => {
          calculate(clientId, 0, client.balance, rate)
            .then(() => Sale.check(clientId)
              .then(() => res()));
        });
    })
    .catch(error => rej(error));
});
