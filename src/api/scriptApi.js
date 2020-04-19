import api from "./api";
import {paginationParams} from "../data/dto/pagination_dto";

const scriptMapping = "/scripts/source";

export default {
  getScripts: (page, size, order, orderBy) => api.get(scriptMapping, paginationParams(page, size, order, orderBy)),
  getSessionScripts: () => api.get(`${scriptMapping}/session`),
  addScript: formData => api.put(scriptMapping, formData),
  deleteScript: scriptId => api.delete(`${scriptMapping}/${scriptId}`),
  getScript: scriptId => api.get(`${scriptMapping}/${scriptId}`),
  downloadScript: scriptId => api.get(`${scriptMapping}/${scriptId}/file`, {
    responseType: 'blob'
  })
}