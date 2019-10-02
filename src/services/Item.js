/* eslint-disable camelcase */
import Api, { execute } from './Api';

export default {
  getAll: batchId => execute(Api().get(`items/${batchId}`)),

  create: item => execute(Api().post('items/', item)),

  update: (id, item) => execute(Api().post(`items/${id}`, item)),

  delete: id => Api().delete(`items/${id}`),
};
