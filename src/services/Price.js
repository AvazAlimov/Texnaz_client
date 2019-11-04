import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('prices')),

  getAllLogs: () => execute(Api().get('prices/logs')),

  get: id => execute(Api().get(`prices/${id}`)),

  getUnpricedProducts: () => execute(Api().get('prices/unpriced')),

  createMultiple: prices => execute(Api().post('prices', { prices })),
};
