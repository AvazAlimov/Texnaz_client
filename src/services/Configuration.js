import Api, { execute } from './Api';

export default {
  getAll: () => execute(Api().get('configurations/')),

  getExchangeRate: () => execute(Api().get('configurations/exchange')),

  getOfficialRate: () => execute(Api().get('configurations/official')),

  update: (id, value) => execute(Api().post(`configurations/${id}`, { value })),
};
