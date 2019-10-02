import Api, { execute } from './Api';

export default {
  getAll: id => execute(Api().get(`losts/${id}`)),
  found: object => execute(Api().post('losts', object)),
};
