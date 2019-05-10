import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('prices')),

  createMultiple: prices => execute(Api().post('prices', { prices })),
};
