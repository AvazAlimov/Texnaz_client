import Api, { execute } from './Api';

export default {
  getAllTypes: () => execute(Api().get('myexpanses/types')),
  getAllForms: () => execute(Api().get('myexpanses/forms')),
  getAllPurposes: () => execute(Api().get('myexpanses/purposes')),
  getAllPeople: () => execute(Api().get('myexpanses/people')),

  createType: name => execute(Api().post('myexpanses/types', { name })),
  createForm: name => execute(Api().post('myexpanses/forms', { name })),
  createPurpose: name => execute(Api().post('myexpanses/purposes', { name })),
  createPerson: name => execute(Api().post('myexpanses/people', { name })),

  updateType: (id, name) => execute(Api().post(`myexpanses/types/${id}`, { name })),
  updateForm: (id, name) => execute(Api().post(`myexpanses/forms/${id}`, { name })),
  updatePurpose: (id, name) => execute(Api().post(`myexpanses/purposes/${id}`, { name })),
  updatePerson: (id, name) => execute(Api().post(`myexpanses/people/${id}`, { name })),

  deleteType: id => execute(Api().delete(`myexpanses/types/${id}`)),
  deleteForm: id => execute(Api().delete(`myexpanses/forms/${id}`)),
  deletePurpose: id => execute(Api().delete(`myexpanses/purposes/${id}`)),
  deletePerson: id => execute(Api().delete(`myexpanses/people/${id}`)),

  getAll: userId => execute(Api().get(`myexpanses/?userId=${userId}`)),
  create: expense => execute(Api().post('myexpanses', expense)),
  update: (id, expense) => execute(Api().post(`myexpanses/${id}`, expense)),
  delete: id => execute(Api().delete(`myexpanses/${id}`)),
};
