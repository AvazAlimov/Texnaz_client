import Vue from 'vue';
import router from '../router';
import Permissions from '../utils/Permissions';
import batch from './prototypes/batch';

Vue.prototype.$batch = data => batch(data);

Vue.prototype.$permissions = Permissions;

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
