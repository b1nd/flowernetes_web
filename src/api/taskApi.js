import api from "./api";

const tasksMapping = "/tasks";

export default {
  addTask: taskDto => api.put(tasksMapping, taskDto),
  updateTask: (taskId, taskDto) => api.patch(`${tasksMapping}/${taskId}`, taskDto),
  getTasks: () => api.get(tasksMapping),
  deleteTask: taskId => api.delete(`${tasksMapping}/${taskId}`),
  runTask: taskId => api.post(`${tasksMapping}/${taskId}/run`),
  scheduleTask: taskId => api.post(`${tasksMapping}/${taskId}/schedule`),
  unscheduleTask: taskId => api.post(`${tasksMapping}/${taskId}/unschedule`)
}