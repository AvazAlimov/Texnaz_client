import Api, { execute } from './Api';

export default {
  getAll: id => execute(Api().get(`returns/${id}`)),

};
