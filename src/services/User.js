import Vue from 'vue';
import Api, { execute } from './Api';

function byProvince() {
  return Vue.prototype.$hasRole(1) ? ''
    : `provinceId=${Vue.prototype.$provinceId()}`;
}

export default {
  getAll: () => execute(Api().get(`users?${byProvince()}`)),

  get: id => execute(Api().get(`users/${id}`)),

  create: ({
    name, username, password, provinceId, roles,
  }) => execute(Api().post('users/', {
    name, username, password, provinceId, roles,
  })),

  update: (id, {
    name, username, password, provinceId, roles,
  }) => execute(Api().post(`users/${id}`, {
    name, username, password, provinceId, roles,
  })),

  delete: id => Api().delete(`users/${id}`),
};
