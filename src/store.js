import Vue from 'vue';
import Vuex from 'vuex';
import { AXIOS } from './services/Api';
import Auth from './services/Auth';
import batch from './modules/batch';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    message: '',
  },
  mutations: {
    setMessage(state, message) {
      // eslint-disable-next-line no-param-reassign
      state.message = message;
    },
    setToken(state, token) {
      localStorage.setItem('token', token);
      AXIOS.defaults.headers.common.Authorization = `Bearer ${token}`;
      // eslint-disable-next-line no-param-reassign
      state.token = token;
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // eslint-disable-next-line no-param-reassign
      state.token = '';
    },
  },
  actions: {
    login: ({ commit }, { username, password }) => new Promise((resolve, reject) => {
      Auth
        .login({ username, password })
        .then((token) => {
          commit('setToken', token);
          Auth
            .details()
            .then((user) => {
              localStorage.setItem('user', JSON.stringify(user));
              resolve();
            })
            .catch(error => reject(error));
        }).catch(error => reject(error));
    }),
  },
  modules: {
    batch,
  },
});
