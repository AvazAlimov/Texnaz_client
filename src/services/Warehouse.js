import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('warehouses/')),

  get: id => execute(Api().get(`warehouses/${id}`)),

  create: ({
    name, owner, address, company, supply,
  }) => execute(Api().post('warehouses/', {
    name, owner, address, company, supply,
  })),

  update: (id, {
    name, owner, address, company, supply,
  }) => execute(Api().post(`warehouses/${id}`, {
    name, owner, address, company, supply,
  })),

  delete: id => Api().delete(`warehouses/${id}`),
};
