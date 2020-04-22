import {TaskStatus} from "../dto/task_dto";

export const TaskStatusColor = {
  [TaskStatus.WAITING]: "accent",
  [TaskStatus.PENDING]: "primary",
  [TaskStatus.RUNNING]: "warning",
  [TaskStatus.ERROR]: "error",
  [TaskStatus.SUCCESS]: "success"
};