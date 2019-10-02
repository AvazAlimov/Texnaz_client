/* eslint-disable camelcase */
import Api, { execute } from './Api';

export default {
  getAll: batchId => execute(Api().get(`batch_expanses/${batchId}`)),

  create: ({
    name, value, is_transport, is_cash, batchId,
  }) => execute(Api().post('batch_expanses/', {
    name, value, is_transport, is_cash, batchId,
  })),

  update: (id, {
    name, value, is_transport, is_cash, batchId,
  }) => execute(Api().post(`batch_expanses/${id}`, {
    name, value, is_transport, is_cash, batchId,
  })),

  delete: id => Api().delete(`batch_expanses/${id}`),
};
