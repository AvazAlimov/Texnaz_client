import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('roles/')),
};
