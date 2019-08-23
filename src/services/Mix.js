import Vue from 'vue';
import Api, { execute } from './Api';

function byProvince() {
  return Vue.prototype.$hasRole(1) ? ''
    : `provinceId=${Vue.prototype.$provinceId()}`;
}

export default {
  getAll: () => execute(Api().get(`mixes?${byProvince()}`)),
  get: id => execute(Api().get(`mixes/${id}`)),
  getByProperty: properties => execute(
    Api().get(`mixes/?${Object.keys(properties).map(key => `${key}=${properties[key]}`).join('&')}&${byProvince()}`),
  ),
  create: mix => execute(Api().post('mixes', mix)),
  update: (id, mix) => execute(Api().post(`mixes/${id}`, mix)),
  delete: id => execute(Api().delete(`mixes/${id}`)),
};
