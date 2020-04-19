import api from "./api";

const tasksMapping = "/tasks";

export default {
  addTask: taskDto => api.put(tasksMapping, taskDto),
  deleteTask: taskId => api.delete(`${tasksMapping}/${taskId}`)
}