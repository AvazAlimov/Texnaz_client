import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('territories')),

  get: id => execute(Api().get(`territories/${id}`)),
};
