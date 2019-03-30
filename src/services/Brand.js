import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('brands/')),

  get: id => execute(Api().get(`brands/${id}`)),

  create: ({ name, country }) => execute(Api().post('brands/', { name, country })),

  update: (id, { name, country }) => execute(Api().post(`brands/${id}`, { name, country })),

  delete: id => Api().delete(`brands/${id}`),
};
