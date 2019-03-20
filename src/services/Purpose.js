import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api.get('purposes/')),

  get: id => execute(Api.get(`purposes/${id}`)),

  create: ({ number, description }) => execute(Api.post('purposes/', { number, description })),

  update: (id, { number, description }) => execute(Api.post(`purposes/${id}`, { number, description })),

  delete: id => Api.delete(`purposes/${id}`),
};
