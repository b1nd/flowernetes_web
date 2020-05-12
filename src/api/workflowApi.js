import api from "./api";

const workflowsMapping = "/workflows";

export default {
  getWorkflows: () => api.get(workflowsMapping),
  addWorkflow: workflowDto => api.put(workflowsMapping, workflowDto),
  getWorkflowTasks: workflowId => api.get(`${workflowsMapping}/${workflowId}/tasks`),
  getWorkflowTasksStatusInfo: workflowId => api.get(`${workflowsMapping}/${workflowId}/tasks/status`),
  getWorkflowGraph: workflowId => api.get(`${workflowsMapping}/${workflowId}/graph`),
  getWorkflowGanttChart: (workflowId, date) => api.get(`${workflowsMapping}/${workflowId}/gantt`, {
    params: {
      date: date
    }
  }),
  getWorkflowRamUsage: (workflowId, from, to) => api.get(`${workflowsMapping}/${workflowId}/ram`, {
    params: {
      from: from,
      to: to
    }
  }),
  getWorkflowCpuUsage: (workflowId, from, to) => api.get(`${workflowsMapping}/${workflowId}/cpu`, {
    params: {
      from: from,
      to: to
    }
  }),
  getWorkflowTasksDuration: (workflowId, taskDurationFilter) =>
    api.post(`${workflowsMapping}/${workflowId}/duration`, taskDurationFilter)
}