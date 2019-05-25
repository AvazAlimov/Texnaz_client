import Api, { execute } from './Api';

export default {
  createMultiple: moves => execute(Api().post('moves', { moves })),

  acceptMultiple: moves => execute(Api().post('moves/accept', { moves })),

  //   acceptMultiple: preStocks => execute(Api().post('moves/accept', { preStocks })),

  getAll: (to, from) => execute(Api().get(`moves/?to=${to || ''}&from=${from || ''}`)),

  getAllPending: warehouseId => execute(Api().get(`moves/${warehouseId}`)),
};
