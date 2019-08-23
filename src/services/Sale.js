import Vue from 'vue';
import Api, { execute } from './Api';

function byProvince() {
  return Vue.prototype.$hasRole(1) ? ''
    : `provinceId=${Vue.prototype.$provinceId()}`;
}

export default {
  getAll: () => execute(Api().get(`sales?${byProvince()}`)),
  get: id => execute(Api().get(`sales/${id}`)),

  getByProperty: ({ approved, managerId, shipped }) => execute(Api()
    .get(`sales/?${
      approved != null ? `approved=${approved}` : ''
    }&${
      managerId != null ? `managerId=${managerId}` : ''
    }&${
      shipped != null ? `shipped=${shipped}` : ''
    }&${byProvince()}`)),

  approveShipment: id => execute(Api().post(`sales/shipment/approve/${id}`)),
  rejectShipment: id => execute(Api().post(`sales/shipment/reject/${id}`)),
  return: items => execute(Api().put('sales', { items })),

  getByNumber: number => execute(Api().get(`sales/?number=${number}`)),
  getByManagerId: managerId => execute(Api().get(`sales/?managerId=${managerId}`)),
  getByStatus: status => execute(Api().get(`sales/?approved=${status}&${byProvince()}`)),
  getByShipped: (warehouseId, shipped) => execute(Api().get(`sales/?warehouseId=${warehouseId}&shipped=${shipped}&approved=1`)),
  create: sale => execute(Api().post('sales', sale)),
  update: (id, sale) => execute(Api().post(`sales/${id}`, sale)),
  delete: id => execute(Api().delete(`sales/${id}`)),
  approve: id => execute(Api().post(`sales/approve/${id}`)),
  disapprove: id => execute(Api().post(`sales/disapprove/${id}`)),
};
