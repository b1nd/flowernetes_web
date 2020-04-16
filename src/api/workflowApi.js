import api from "./api";

const workflowsMapping = "/workflows";

export default {
  getWorkflows: () => api.get(workflowsMapping),
  addWorkflow: workflowDto => api.put(workflowsMapping, workflowDto)
}