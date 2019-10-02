import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('regions/')),

  get: id => execute(Api().get(`regions/${id}`)),

  create: ({ name, provinceId }) => execute(Api().post('regions/', { name, provinceId })),

  update: (id, { name, provinceId }) => execute(Api().post(`regions/${id}`, { name, provinceId })),

  delete: id => Api().delete(`regions/${id}`),
};
