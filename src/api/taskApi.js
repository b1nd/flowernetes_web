import api from "./api";

const tasksMapping = "/tasks";

export default {
  addTask: taskDto => api.put(tasksMapping, taskDto),
  deleteTask: taskId => api.delete(`${tasksMapping}/${taskId}`),
  runTask: taskId => api.post(`${tasksMapping}/${taskId}/run`),
  scheduleTask: taskId => api.post(`${tasksMapping}/${taskId}/schedule`),
  unscheduleTask: taskId => api.post(`${tasksMapping}/${taskId}/unschedule`)
}