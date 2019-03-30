import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('product_types/')),

  get: id => execute(Api().get(`product_types/${id}`)),

  create: ({ name }) => execute(Api().post('product_types/', { name })),

  update: (id, { name }) => execute(Api().post(`product_types/${id}`, { name })),

  delete: id => Api().delete(`product_types/${id}`),
};
