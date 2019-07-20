import Vue from 'vue';
import router from '../router';
import Permissions from '../utils/Permissions';
import batch from './prototypes/batch';
import price from './prototypes/price';

Vue.prototype.$permissions = Permissions;

Vue.prototype.$batch = data => batch(data);

Vue.prototype.$price = (data, rate) => price(data, rate);

Vue.prototype.$hasPermission = (key) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    router.push({ name: 'login' });
    return false;
  }
  const permissions = [];
  user.roles.forEach((role) => {
    role.permissions.forEach((permission) => {
      permissions.push(permission);
    });
  });
  return !!permissions.find(permission => permission.name === key);
};

Vue.prototype.$hasRole = (id) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    router.push({ name: 'login' });
    return false;
  }
  return !!user.roles.find(role => role.id === id);
};

Vue.prototype.$getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    router.push({ name: 'login' });
    return false;
  }
  return user.id;
};

Vue.prototype.$getClients = (clients) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (Vue.prototype.$hasRole(1) || Vue.prototype.$hasRole(6)) {
    return clients;
  }
  if (Vue.prototype.$hasRole(2)) {
    return clients.filter(client => client.managerId === user.id);
  }
  return [];
};

Vue.prototype.$getTotalPrice = (sale, exchangeRate, officialRate) => {
  let total = 0;
  switch (sale.type) {
    case 1:
      sale.items.forEach((item) => {
        const itemPrice = price(item.price, exchangeRate);
        total += (itemPrice.firstPrice * item.quantity
          * (100 - item.discount) / 100)
          / officialRate;
      });
      break;
    case 2:
      sale.items.forEach((item) => {
        const itemPrice = price(item.price, exchangeRate);
        total += (itemPrice.mixPriceNonCash / exchangeRate
          + itemPrice.mixPriceCash)
          * item.quantity
          * (100 - item.discount) / 100;
      });
      break;
    case 3:
      sale.items.forEach((item) => {
        const itemPrice = price(item.price, exchangeRate);
        total += itemPrice.secondPrice
                  * item.quantity
                  * (100 - item.discount) / 100;
      });
      break;
    case 4:
      sale.items.forEach((item) => {
        total += item.commissionPrice / exchangeRate
                  * item.quantity
                  * (100 - item.discount) / 100;
      });
      break;
    default:
      break;
  }
  return total;
};

Vue.prototype.$getClientBalance = (client) => {
  let balance = 0;
  if (client.payments) {
    client.payments.forEach((payment) => {
      if (payment.approved) { balance += payment.sum / payment.ratio; }
    });
  }
  return balance;
};
