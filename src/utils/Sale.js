import { calculate } from './Payment';
import Client from '@/services/Client';

export default (clientId, rate) => {
  Client.get(clientId)
    .then((client) => {
      if (client.balance > 0) {
        calculate(clientId, 0, client.balance, rate);
      }
    })
    .catch(error => console.error(error));
};
