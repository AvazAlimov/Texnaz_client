import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('prices')),

  getUnpricedProducts: () => execute(Api().get('prices/unpriced')),

  createMultiple: prices => execute(Api().post('prices', { prices })),
};
