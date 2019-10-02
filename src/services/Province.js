import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('provinces/')),
  get: id => execute(Api().get(`provinces/${id}`)),
};
