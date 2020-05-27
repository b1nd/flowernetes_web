import api from "./api";
import {paginationParams} from "../data/dto/pagination_dto";

const workloadMapping = "/workloads";

export default {
  getWorkloads: (page, size, properties, directions) =>
    api.get(workloadMapping, paginationParams(page, size, properties, directions)),
  getFilteredWorkloads: (page, size, properties, directions, workloadFilter) =>
    api.post(workloadMapping, workloadFilter, paginationParams(page, size, properties, directions)),
  downloadLogFile: workloadId => api.get(`${workloadMapping}/${workloadId}/log`, {responseType: 'blob'}),
  downloadOutputFile: workloadId => api.get(`${workloadMapping}/${workloadId}/output`, {responseType: 'blob'})
}