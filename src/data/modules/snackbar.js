import {HIDE_SNACKBAR, SHOW_SNACKBAR} from "../constants/snackbar_constants";

const state = {
  showSnackbar: false,
  snackbarMessage: ""
};

const getters = {
  showSnackbar: state => state.showSnackbar,
  snackbarMessage: state => state.snackbarMessage
};

const actions = {
  async [SHOW_SNACKBAR]({commit}, message) {
    commit(SHOW_SNACKBAR, message);
  },
  async [HIDE_SNACKBAR]({commit}) {
    commit(HIDE_SNACKBAR);
  }
};

const mutations = {
  [SHOW_SNACKBAR](state, message) {
    state.snackbarMessage = message;
    state.showSnackbar = true;
  },
  [HIDE_SNACKBAR](state) {
    state.showSnackbar = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};