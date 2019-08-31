import Vue from 'vue';
import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('users')),

  getByController: () => execute(Api().get(`users?controllerId=${Vue.prototype.$getUserId()}`)),

  getByTerritory: () => execute(Api().get(`users?territoryId=${Vue.prototype.$getUserTerritory()}`)),

  get: id => execute(Api().get(`users/${id}`)),

  create: user => execute(Api().post('users/', user)),

  update: (id, user) => execute(Api().post(`users/${id}`, user)),

  delete: id => Api().delete(`users/${id}`),
};
