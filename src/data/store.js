import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import team from "./modules/team";
import {debugMode} from "./constants/env_constants"
import task from "./modules/task";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    team,
    task
  },
  strict: debugMode
});