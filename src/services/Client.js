import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('clients/')),

  get: id => execute(Api().get(`clients/${id}`)),

  create: client => execute(Api().post('clients/', client)),

  update: (id, client) => execute(Api().post(`clients/${id}`, client)),

  delete: id => Api().delete(`clients/${id}`),
};
