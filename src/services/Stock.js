import Api, { execute } from './Api';

export default {
  createStocks: stocks => execute(Api().post('stocks', { stocks })),

  getByWarehouse: warehouse => execute(Api().get(`stocks/?warehouse=${warehouse}`)),

  getByProductId: id => execute(Api().get(`stocks/product/${id}`)),

  get: id => execute(Api().get(`stocks/${id}`)),
};
