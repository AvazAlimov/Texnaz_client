import axios from 'axios';

export function execute(promise) {
  return new Promise((resolve, reject) => {
    promise.then((response) => {
      resolve(response.data);
    })
      .catch((error) => {
        if (error.response) {
          reject(new Error(error.response.status));
        } else if (error.request) {
          reject(new Error('No response was received'));
        } else {
          reject(new Error('Error in request'));
        }
      });
  });
}

export const AXIOS = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'http://erp.texnaz.uz/api/' : 'http://localhost:3030/api/',
});

export default () => {
  axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return AXIOS;
};
