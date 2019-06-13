import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('sales')),
  get: id => execute(Api().get(`sales/${id}`)),
  create: sale => execute(Api().post('sales', sale)),
  approve: id => execute(Api().post(`sales/approve/${id}`)),
  disapprove: id => execute(Api().post(`sales/disapprove/${id}`)),
};
