import Api, { execute } from './Api';

export default {
  getColors: () => execute(Api().get('info/colors')),
};
