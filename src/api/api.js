import axios from 'axios'
import store from "../data/store.js";
import {apiUrl} from "../data/constants/env_constants"
import {AUTH_LOGOUT} from "../data/constants/auth_constants";
import {debug, debugError} from "../utils/logging";

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
  debugError(error.response.data);
  return Promise.reject(error);
});

export function cleanAuthorizationHeader() {
  delete api.defaults.headers.common['Authorization'];
}

export function setAuthorizationHeader(header) {
  api.defaults.headers.common['Authorization'] = header;
}

export function getFileNameFromHeader(response) {
  const disposition = response.headers["content-disposition"];
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
  }
  throw Error(`Cannot get file name from Content-Disposition header: ${disposition}`)
}

export default api;