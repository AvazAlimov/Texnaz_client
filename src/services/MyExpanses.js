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

  create: expense => execute(Api().post('myexpanses', expense)),
  getAll: () => execute(Api().get('myexpanses')),
};
