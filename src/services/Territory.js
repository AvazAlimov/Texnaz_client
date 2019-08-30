import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('api/territories')),

  get: id => execute(Api().get(`api/territories/${id}`)),
};
