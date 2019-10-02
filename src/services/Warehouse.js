import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('warehouses/')),

  get: id => execute(Api().get(`warehouses/${id}`)),

  create: ({
    name, provinceId, ownerId, company, type,
  }) => execute(Api().post('warehouses/', {
    name, provinceId, ownerId, company, type,
  })),

  update: (id, {
    name, provinceId, ownerId, company, type,
  }) => execute(Api().post(`warehouses/${id}`, {
    name, provinceId, ownerId, company, type,
  })),

  delete: id => Api().delete(`warehouses/${id}`),
};
