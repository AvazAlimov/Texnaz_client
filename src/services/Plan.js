import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('plans')),
  get: id => execute(Api().get(`plans/${id}`)),
  getByProperty: properties => execute(
    Api().get(`plans/?${Object.keys(properties).map(key => `${key}=${properties[key]}`).join('&')}`),
  ),
  create: plan => execute(Api().post('plans', plan)),
  update: (id, plan) => execute(Api().post(`plans/${id}`, plan)),
  delete: id => execute(Api().delete(`plans/${id}`)),
};
