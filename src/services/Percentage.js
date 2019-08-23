import Vue from 'vue';
import Api, { execute } from './Api';

function byProvince() {
  return Vue.prototype.$hasRole(1) ? ''
    : `provinceId=${Vue.prototype.$provinceId()}`;
}

export default {
  getAll: () => execute(Api().get(`percentages?${byProvince()}`)),
  get: id => execute(Api().get(`percentages/${id}`)),
  getByProperty: properties => execute(
    Api().get(`percentages/?${Object.keys(properties).map(key => `${key}=${properties[key]}`).join('&')}&${byProvince()}`),
  ),
  create: percentage => execute(Api().post('percentages', percentage)),
  update: (id, percentage) => execute(Api().post(`percentages/${id}`, percentage)),
  delete: id => execute(Api().delete(`percentages/${id}`)),
};
