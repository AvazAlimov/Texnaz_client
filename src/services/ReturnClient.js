import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('returnclients')),
  create: returnItem => execute(Api().post('returnclients', returnItem)),
};
