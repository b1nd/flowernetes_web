import axios from 'axios'
import store from "../data/store.js";
import {apiUrl} from "../data/constants/env_constants"
import {AUTH_LOGOUT} from "../data/constants/auth_constants";
import {debug} from "../utils/logging";

const api = axios.create({
  baseURL: apiUrl
});

api.interceptors.response.use(response => response, async function (error) {
  if (error.response.status === 401) {
    await store.dispatch(AUTH_LOGOUT)
        .then(() => {
          debug("Token is bad or expired!");
        });
  }
  return Promise.reject(error);
});

export function cleanAuthorizationHeader() {
  delete api.defaults.headers.common['Authorization'];
}

export function setAuthorizationHeader(header) {
  api.defaults.headers.common['Authorization'] = header;
}

export default api;