import Api, { execute } from './Api';

export default {
  create: payment => execute(Api().post('payments', payment)),
  updateCurrentBalance: (paymentId, value) => execute(Api().post(`payments/${paymentId}?value=${value}`)),
  getAll: () => execute(Api().get('payments')),
  getApproved: () => execute(Api().get('payments?approved=1')),
  get: id => execute(Api().get(`payments/${id}`)),
  getByNumber: number => execute(Api().get(`payments/?number=${number}`)),
  getByUser: userId => execute(Api().get(`payments?userId=${userId}`)),
  getPagined: (page, pageSize, approved) => execute(Api().get(`payments/paginate?approved=${approved}&page=${page}&pageSize=${pageSize}`)),
  approve: id => execute(Api().post(`payments/approve/${id}`)),
  delete: id => execute(Api().delete(`payments/${id}`)),
};
