import Api, { execute } from './Api';

export default {
  createMultiple: preStocks => execute(Api().post('preStocks', { preStocks })),

  getByWarehouse: warehouse => execute(Api().get(`preStocks/?warehouse=${warehouse}`)),
};
