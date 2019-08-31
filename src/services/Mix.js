import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('mixes')),
  get: id => execute(Api().get(`mixes/${id}`)),
  getByProperty: properties => execute(
    Api().get(`mixes/?${Object.keys(properties).map(key => `${key}=${properties[key]}`).join('&')}`),
  ),
  create: mix => execute(Api().post('mixes', mix)),
  update: (id, mix) => execute(Api().post(`mixes/${id}`, mix)),
  delete: id => execute(Api().delete(`mixes/${id}`)),
};
