import Api, { execute } from './Api';

export default {
  createMultiple: bookings => execute(Api().post('bookings', { bookings })),

  getAll: (userId, clientId) => execute(Api().get(`bookings/?userId=${userId || ''}&clientId=${clientId || ''}`)),

  delete: id => execute(Api().delete(`bookings/${id}`)),
};
