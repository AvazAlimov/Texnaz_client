import Api, { execute } from './Api';

export default {
  getColors: () => execute(Api().get('info/colors')),
  getWarehouseTypes: () => execute(Api().get('info/warehouse_types')),
};
