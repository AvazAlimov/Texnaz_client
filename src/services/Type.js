import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api.get('types/')),

  get: id => execute(Api.get(`types/${id}`)),

  create: ({ name }) => execute(Api.post('types/', { name })),

  update: (id, { name }) => execute(Api.post(`types/${id}`, { name })),

  delete: id => Api.delete(`types/${id}`),
};
