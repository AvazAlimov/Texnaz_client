/* eslint-disable no-shadow */
import Batch from '../models/Batch';

const state = {
  batches: [],
};

const getters = {

};

const mutations = {
  addBatch(state, batch) {
    if (!(batch instanceof Batch)) { throw new Error('Must be Batch type'); }
    state.batches.push(new Batch(batch));
  },
};

const actions = {
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
