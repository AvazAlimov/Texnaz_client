import Vue from 'vue';
import Api, { execute } from './Api';

function byProvince() {
  return Vue.prototype.$hasRole(1) ? ''
    : `provinceId=${Vue.prototype.$provinceId()}`;
}

export default {
  getAll: () => execute(Api().get(`plans?${byProvince()}`)),
  get: id => execute(Api().get(`plans/${id}`)),
  getByProperty: properties => execute(
    Api().get(`plans/?${Object.keys(properties).map(key => `${key}=${properties[key]}`).join('&')}&${byProvince()}`),
  ),
  create: plan => execute(Api().post('plans', plan)),
  update: (id, plan) => execute(Api().post(`plans/${id}`, plan)),
  delete: id => execute(Api().delete(`plans/${id}`)),
};
