import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions.js';
import mutations from './mutations.js';
import getters from './getters.js';
import state from './state.js';

Vue.use(Vuex)

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});

export default store;