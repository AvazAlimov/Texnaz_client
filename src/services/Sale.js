import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('sales')),
  get: id => execute(Api().get(`sales/${id}`)),

  getByProperty: ({ approved, managerId, shipped }) => execute(Api()
    .get(`sales/?${
      approved != null ? `approved=${approved}` : ''
    }&${
      managerId != null ? `managerId=${managerId}` : ''
    }&${
      shipped != null ? `shipped=${shipped}` : ''
    }`)),

  approveShipment: (id, officialRate, exchangeRate) => execute(Api().post(`sales/shipment/approve/${id}`, { officialRate, exchangeRate })),
  rejectShipment: id => execute(Api().post(`sales/shipment/reject/${id}`)),
  return: items => execute(Api().put('sales', { items })),

  getByProvince: id => execute(Api().get(`sales?provinceId=${id}&shipped=1`)),
  getAllByShipped: () => execute(Api().get('sales?shipped=1')),
  getByWarehouse: id => execute(Api().get(`sales?warehouseId=${id}`)),
  getByNumber: number => execute(Api().get(`sales/?number=${number}`)),
  getByManagerId: managerId => execute(Api().get(`sales/?managerId=${managerId}`)),
  getByStatus: status => execute(Api().get(`sales/?approved=${status}`)),
  getByClient: clientId => execute(Api().get(`sales?isClosed=false&clientId=${clientId}`)),
  getByShipped: (warehouseId, shipped) => execute(Api().get(`sales/?warehouseId=${warehouseId}&shipped=${shipped}&approved=1`)),
  create: sale => execute(Api().post('sales', sale)),
  update: (id, sale) => execute(Api().post(`sales/${id}`, sale)),
  updateSaleItem: (id, saleItem) => execute(Api().post(`sales/saleItem/${id}`, { ...saleItem })),
  check: id => execute(Api().post(`sales/check/${id}`)),
  delete: id => execute(Api().delete(`sales/${id}`)),
  accept: id => execute(Api().post(`sales/accept/${id}`)),
  approve: id => execute(Api().post(`sales/approve/${id}`)),
  disapprove: id => execute(Api().post(`sales/disapprove/${id}`)),
};
