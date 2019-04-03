/* eslint-disable camelcase */
import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('batches/')),

  get: id => execute(Api().get(`batches/${id}`)),

  create: () => execute(Api().post('batches/')),

  //   update: (id, { name, country }) => execute(Api().post(`batches/${id}`, { name, country })),

  delete: id => Api().delete(`batches/${id}`),
};
