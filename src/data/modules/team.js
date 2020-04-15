import {SESSION_TEAM} from "../constants/team_constants";
import teamApi from "../../api/teamApi";
import {debug} from "../../utils/logging";

const state = {
  sessionTeam: undefined
};

const getters = {
  sessionTeam: state => state.sessionTeam
};

const actions = {
  async [SESSION_TEAM]({commit, rootGetters}) {
    if (rootGetters.isTeam) {
      teamApi.sessionTeam().then(response => {
        const team = response.data;
        debug(SESSION_TEAM, "sessionTeam:", team);
        commit(SESSION_TEAM, team);
      })
    }
  }
};

const mutations = {
  [SESSION_TEAM](state, team) {
    state.sessionTeam = team;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};