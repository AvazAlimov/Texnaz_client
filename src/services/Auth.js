import Api from './Api';

export default {
  login({ username, password }) {
    return new Promise((resolve, reject) => {
      Api()
        .post('auth/login/', { username, password })
        .then((response) => {
          resolve(response.data.token);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.status);
          } else if (error.request) {
            reject(new Error('No response was received'));
          } else {
            reject(new Error('Error in request'));
          }
        });
    });
  },

  details() {
    return new Promise((resolve, reject) => {
      Api()
        .get('auth/details/')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (error.response) {
            reject(error.response.status);
          } else if (error.request) {
            reject(new Error('No response was received'));
          } else {
            reject(new Error('Error in request'));
          }
        });
    });
  },
};
