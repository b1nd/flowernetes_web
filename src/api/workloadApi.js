import api from "./api";
import {paginationParams} from "../data/dto/pagination_dto";

const workloadMapping = "/workloads";

export default {
  getWorkloads: (page, size, order, orderBy) => api.get(workloadMapping, paginationParams(page, size, order, orderBy))
}