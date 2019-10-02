import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('tags/')),

  get: id => execute(Api().get(`tags/${id}`)),

  create: ({ name }) => execute(Api().post('tags/', { name })),

  update: (id, { name }) => execute(Api().post(`tags/${id}`, { name })),

  delete: id => Api().delete(`tags/${id}`),
};
