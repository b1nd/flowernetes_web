import {
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_REFRESH,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  SYSTEM_USER_ROLE,
  USER_TOKEN_NAME
} from "../constants/auth_constants";
import authApi from "../../api/auth_api";
import {cleanAuthorizationHeader, setAuthorizationHeader} from "../../api/api";
import {getItemOrEmpty, getItemOrThrow, removeItem, setItem} from "../../utils/local_storage";
import {debug, debugError} from "../../utils/logging";
import {SESSION_TEAM} from "../constants/team_constants";
import {UPDATE_AVAILABLE_TASKS} from "../constants/task_constants";

const state = {
  token: getItemOrEmpty(USER_TOKEN_NAME),
  username: "",
  systemUserRole: ""
};

const getters = {
  isAuthenticated: state => !!state.token,
  username: state => state.username,
  systemUserRole: state => state.systemUserRole,
  isTeam: (state, rootGetters) => rootGetters.isAuthenticated && state.systemUserRole === SYSTEM_USER_ROLE.TEAM,
  isAdmin: (state, rootGetters) => rootGetters.isAuthenticated && !rootGetters.isTeam && state.systemUserRole === SYSTEM_USER_ROLE.ADMIN
};

const actions = {
  async [AUTH_REQUEST]({commit, dispatch}, credentials) {
    await authApi.login(credentials)
      .then(response => {
        const tokenResponse = response.data;
        debug(AUTH_REQUEST, "tokenResponse:", tokenResponse);
        setItem(USER_TOKEN_NAME, tokenResponse.token);
      })
      .catch(err => {
        debugError(AUTH_REQUEST, err.message, err.response.data.message);
        removeItem(USER_TOKEN_NAME);
        commit(AUTH_ERROR, err);
        throw err
      })
      .then(() => dispatch(AUTH_REFRESH))
  },
  async [AUTH_LOGOUT]({commit}) {
    removeItem(USER_TOKEN_NAME);
    cleanAuthorizationHeader();
    commit(AUTH_LOGOUT);
  },
  async [AUTH_REFRESH]({commit, dispatch}) {
    try {
      const token = getItemOrThrow(USER_TOKEN_NAME);
      setAuthorizationHeader("Bearer " + token);

      await authApi.userInfo()
        .then(response => {
          const userInfoResponse = response.data;
          debug(AUTH_REFRESH, "userInfoResponse:", userInfoResponse);
          return userInfoResponse;
        })
        .catch(err => {
          debugError(AUTH_REFRESH, err.message, err.response.data.message);
          throw err
        })
        .then((userInfoResponse) => commit(AUTH_REFRESH, userInfoResponse))
        .then(() => commit(AUTH_SUCCESS, token))
        .then(() => dispatch(SESSION_TEAM))
        .then(() => dispatch(UPDATE_AVAILABLE_TASKS))
    } catch (e) {
      commit(AUTH_ERROR);
      cleanAuthorizationHeader();
      throw e
    }
  }
};

const mutations = {
  [AUTH_SUCCESS](state, token) {
    state.token = token;
  },
  [AUTH_ERROR](state) {
    state.token = "";
    state.username = "";
    state.systemUserRole = "";
  },
  [AUTH_LOGOUT](state) {
    state.token = "";
    state.username = "";
    state.systemUserRole = "";
  },
  [AUTH_REFRESH](state, userInfoResponse) {
    state.username = userInfoResponse.username;
    state.systemUserRole = userInfoResponse.systemUserRole;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
