import api from "./api";
import {paginationParams} from "../data/dto/pagination_dto";

const workloadMapping = "/workloads";

export default {
  getWorkloads: (page, size, order, orderBy) => api.get(workloadMapping, paginationParams(page, size, order, orderBy)),
  downloadLogFile: workloadId => api.get(`${workloadMapping}/${workloadId}/log`, {responseType: 'blob'}),
  downloadOutputFile: workloadId => api.get(`${workloadMapping}/${workloadId}/output`, {responseType: 'blob'})
}