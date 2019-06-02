import Api, { execute } from './Api';

export default {
  create: payment => execute(Api().post('payments', payment)),
  getAll: () => execute(Api().get('payments')),
  get: id => execute(Api().get(`payments/${id}`)),
  approve: id => execute(Api().post(`payments/approve/${id}`)),
};
