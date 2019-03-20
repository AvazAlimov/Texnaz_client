import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api.get('users/')),

  get: id => execute(Api.get(`users/${id}`)),

  create: ({ username, password, roles }) => execute(Api.post('users/', { username, password, roles })),

  update: (id, { username, password, roles }) => execute(Api.post(`users/${id}`, { username, password, roles })),

  delete: id => Api.delete(`users/${id}`),
};
