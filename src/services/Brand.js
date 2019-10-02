import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('brands/')),

  get: id => execute(Api().get(`brands/${id}`)),

  create: ({ name, country, manufacturer }) => execute(Api().post('brands/', { name, country, manufacturer })),

  update: (id, { name, country, manufacturer }) => execute(Api().post(`brands/${id}`, { name, country, manufacturer })),

  delete: id => Api().delete(`brands/${id}`),
};
