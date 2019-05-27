import Api, { execute } from './Api';

export default {
  getAll: id => execute(Api().get(`losts/${id}`)),
};
