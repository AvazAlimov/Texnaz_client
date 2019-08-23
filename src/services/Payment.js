import Vue from 'vue';
import Api, { execute } from './Api';

function byProvince() {
  return Vue.prototype.$hasRole(1) ? 'payments'
    : `payments?provinceId=${Vue.prototype.$provinceId()}`;
}

export default {
  create: payment => execute(Api().post('payments', payment)),
  getAll: () => execute(Api().get(byProvince())),
  get: id => execute(Api().get(`payments/${id}`)),
  getByNumber: number => execute(Api().get(`payments/?number=${number}`)),
  getByUser: userId => execute(Api().get(`payments?userId=${userId}`)),
  approve: id => execute(Api().post(`payments/approve/${id}`)),
  delete: id => execute(Api().delete(`payments/${id}`)),
};
