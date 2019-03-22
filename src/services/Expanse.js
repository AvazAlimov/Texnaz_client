import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api.get('expanses/')),

  get: id => execute(Api.get(`expanses/${id}`)),

  create: ({ name, is_transport, is_cash }) => execute(Api.post('expanses/', { name, is_transport, is_cash })),

  update: (id, { name, is_transport, is_cash }) => execute(Api.post(`expanses/${id}`, { name, is_transport, is_cash })),

  delete: id => Api.delete(`expanses/${id}`),
};
