import {TaskStatus} from "../dto/task_dto";

export const TaskStatusColor = {
  [TaskStatus.INACTIVE]: "primary",
  [TaskStatus.WAITING]: "accent",
  [TaskStatus.PENDING]: "brown",
  [TaskStatus.RUNNING]: "warning",
  [TaskStatus.ERROR]: "error",
  [TaskStatus.QUOTA_EXCEEDED]: "error",
  [TaskStatus.KILLED]: "primary",
  [TaskStatus.SUCCESS]: "success"
};