import Api, { execute } from './Api';

export default {
  createStocks: stocks => execute(Api().post('stocks', { stocks })),

  getByWarehouse: warehouse => execute(Api().get(`stocks/?warehouse=${warehouse}`)),

  get: id => execute(Api().get(`stocks/${id}`)),
};
