import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api.get('products/')),

  get: id => execute(Api.get(`products/${id}`)),

  create: ({
    name, code, packing, color, ratio, unit, type, purpose, tag, profit, cleaning, vat, tax, excise,
  }) => execute(Api.post('products/', {
    name, code, packing, color, ratio, unit, type, purpose, tag, profit, cleaning, vat, tax, excise,
  })),

  update: (id, {
    name, code, packing, color, ratio, unit, type, purpose, tag, profit, cleaning, vat, tax, excise,
  }) => execute(Api.post(`products/${id}`, {
    name, code, packing, color, ratio, unit, type, purpose, tag, profit, cleaning, vat, tax, excise,
  })),

  delete: id => Api.delete(`products/${id}`),
};
