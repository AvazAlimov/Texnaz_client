import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('returnclients')),
  get: id => execute(Api().get(`returnclients/${id}`)),
  create: returnItem => execute(Api().post('returnclients', returnItem)),
};
