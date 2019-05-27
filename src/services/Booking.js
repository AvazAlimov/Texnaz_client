import Api, { execute } from './Api';

export default {
  createMultiple: bookings => execute(Api().post('bookings', { bookings })),

  getAll: (to, from) => execute(Api().get(`bookings/?to=${to || ''}&from=${from || ''}`)),

  deleteMultiple: bookings => execute(Api().delete('bookings', { bookings })),
};
