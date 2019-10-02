import Api, { execute } from './Api';

export default {
  getAll: id => execute(Api().get(`returns/${id}`)),

  acceptMultiple: returns => execute(Api().post('returns/accept', { returns })),
};
