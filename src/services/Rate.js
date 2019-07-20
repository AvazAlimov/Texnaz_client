import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('rates')),

  create: item => execute(Api().post('rates', item)),
};
