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

  getByNumber: number => execute(Api().get(`sales/?number=${number}`)),
  getByManagerId: managerId => execute(Api().get(`sales/?managerId=${managerId}`)),
  getByStatus: status => execute(Api().get(`sales/?approved=${status}`)),
  getByShipped: (warehouseId, shipped) => execute(Api().get(`sales/?warehouseId=${warehouseId}&shipped=${shipped}&approved=1`)),
  create: sale => execute(Api().post('sales', sale)),
  update: (id, sale) => execute(Api().post(`sales/${id}`, sale)),
  delete: id => execute(Api().delete(`sales/${id}`)),
  approve: id => execute(Api().post(`sales/approve/${id}`)),
  disapprove: id => execute(Api().post(`sales/disapprove/${id}`)),
};
