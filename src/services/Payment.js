import Api, { execute } from './Api';

export default {
  create: payment => execute(Api().post('payments', payment)),
  getAll: () => execute(Api().get('payments')),
  get: id => execute(Api().get(`payments/${id}`)),
  getByNumber: number => execute(Api().get(`payments/?number=${number}`)),
  approve: id => execute(Api().post(`payments/approve/${id}`)),
  delete: id => execute(Api().delete(`payments/${id}`)),
};
