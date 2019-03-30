/* eslint-disable camelcase */
import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('batches/')),

  get: id => execute(Api().get(`batches/${id}`)),

  create: ({
    name, number, weight, date, transport_cash, transport_non_cash, warehouse, supply,
  }) => execute(Api().post('batches/', {
    name, number, weight, date, transport_cash, transport_non_cash, warehouse, supply,
  })),

  //   update: (id, { name, country }) => execute(Api().post(`batches/${id}`, { name, country })),

  delete: id => Api().delete(`batches/${id}`),
};
