import Api, { execute } from './Api';

export default {
  createMultiple: preStocks => execute(Api().post('preStocks', { preStocks })),

  acceptMultiple: preStocks => execute(Api().post('preStocks/accept', { preStocks })),

  getByWarehouse: warehouse => execute(Api().get(`preStocks/?warehouse=${warehouse}`)),
};
