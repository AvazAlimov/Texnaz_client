import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('units/')),

  get: id => execute(Api().get(`units/${id}`)),

  create: ({ name }) => execute(Api().post('units/', { name })),

  update: (id, { name }) => execute(Api().post(`units/${id}`, { name })),

  delete: id => Api().delete(`units/${id}`),
};
