import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('clients/')),

  getByProvince: id => execute(Api().get(`clients?provinceId=${id}`)),

  addBalance: (id, balance) => execute(Api().post(`clients/balance/${id}`, { balance })),

  get: id => execute(Api().get(`clients/${id}`)),

  create: client => execute(Api().post('clients/', client)),

  update: (id, client) => execute(Api().post(`clients/${id}`, client)),

  delete: id => Api().delete(`clients/${id}`),
};
