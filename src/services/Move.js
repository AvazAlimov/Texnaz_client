import Api, { execute } from './Api';

export default {
  createMultiple: moves => execute(Api().post('moves', { moves })),

  //   acceptMultiple: preStocks => execute(Api().post('moves/accept', { preStocks })),

//   getByWarehouse: warehouse => execute(Api().get(`moves/?warehouse=${warehouse}`)),
};
