import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('sales')),
  get: id => execute(Api().get(`sales/${id}`)),
  create: sale => execute(Api().post('sales', sale)),
};
