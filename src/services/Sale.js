import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('sales')),
  create: sale => execute(Api().post('sales', sale)),
};
