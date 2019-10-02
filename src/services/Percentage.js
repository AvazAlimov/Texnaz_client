import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('percentages')),
  get: id => execute(Api().get(`percentages/${id}`)),
  getByProperty: properties => execute(
    Api().get(`percentages/?${Object.keys(properties).map(key => `${key}=${properties[key]}`).join('&')}}`),
  ),
  create: percentage => execute(Api().post('percentages', percentage)),
  update: (id, percentage) => execute(Api().post(`percentages/${id}`, percentage)),
  delete: id => execute(Api().delete(`percentages/${id}`)),
};
