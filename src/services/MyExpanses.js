import Api, { execute } from './Api';

export default {
  getAllTypes: () => execute(Api().get('myexpanses/types')),
  getAllForms: () => execute(Api().get('myexpanses/forms')),
  getAllPurposes: () => execute(Api().get('myexpanses/purposes')),
  getAllPeople: () => execute(Api().get('myexpanses/people')),
};
