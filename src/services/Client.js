import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('clients/')),

  getByProvince: id => execute(Api().get(`clients?provinceId=${id}`)),

  getDetails: (icc, from, to) => execute(Api().post('clients/details', { icc, from, to })),

  addBalance: (id, balance) => execute(Api().post(`clients/balance/${id}`, { balance })),

  getByIcc: icc => execute(Api().get(`clients?icc=${icc}`)),

  get: id => execute(Api().get(`clients/${id}`)),

  create: client => execute(Api().post('clients/', client)),

  update: (id, client) => execute(Api().post(`clients/${id}`, client)),

  delete: id => Api().delete(`clients/${id}`),
};
