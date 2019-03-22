import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('suppliers/')),

  get: id => execute(Api().get(`suppliers/${id}`)),

  create: ({ name, country }) => execute(Api().post('suppliers/', { name, country })),

  update: (id, { name, country }) => execute(Api().post(`suppliers/${id}`, { name, country })),

  delete: id => Api().delete(`suppliers/${id}`),
};
