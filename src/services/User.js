import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('users/')),

  get: id => execute(Api().get(`users/${id}`)),

  create: ({
    name, username, password, roles,
  }) => execute(Api().post('users/', {
    name, username, password, roles,
  })),

  update: (id, {
    name, username, password, roles,
  }) => execute(Api().post(`users/${id}`, {
    name, username, password, roles,
  })),

  delete: id => Api().delete(`users/${id}`),
};
