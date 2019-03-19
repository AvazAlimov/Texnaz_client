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
  baseURL: 'http://erp.texnaz.uz/api/',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

export default () => AXIOS;
