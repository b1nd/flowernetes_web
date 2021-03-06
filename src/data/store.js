import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import team from "./modules/team";
import task from "./modules/task";
import snackbar from "./modules/snackbar";
import {debugMode} from "./constants/env_constants"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    team,
    task,
    snackbar
  },
  strict: debugMode
});