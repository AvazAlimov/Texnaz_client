import Api, { execute } from './Api';

export default {
  create: payment => execute(Api().post('payments', payment)),
  getAll: () => execute(Api().get('payments')),
};
