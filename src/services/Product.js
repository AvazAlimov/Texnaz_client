import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('products/')),

  get: id => execute(Api().get(`products/${id}`)),

  create: ({
    name,
    code,
    packing,
    color,
    brand,
    unit,
    type,
    purpose,
    tags,
    cleaning,
    vat,
    tax,
    excise,
    discount,
  }) => execute(
    Api().post('products/', {
      name,
      code,
      packing,
      color,
      brand,
      unit,
      type,
      purpose,
      tags,
      cleaning,
      vat,
      tax,
      excise,
      discount,
    }),
  ),

  update: (
    id,
    {
      name,
      code,
      packing,
      color,
      brand,
      unit,
      type,
      purpose,
      tags,
      cleaning,
      vat,
      tax,
      excise,
      discount,
    },
  ) => execute(
    Api().post(`products/${id}`, {
      name,
      code,
      packing,
      color,
      brand,
      unit,
      type,
      purpose,
      tags,
      cleaning,
      vat,
      tax,
      excise,
      discount,
    }),
  ),

  delete: id => Api().delete(`products/${id}`),

  search: (query, brand, type, code) => execute(
    Api().get(`products/?q=${query || ''}&b=${brand || ''}&t=${type || ''}&c=${code || ''}`),
  ),
};
