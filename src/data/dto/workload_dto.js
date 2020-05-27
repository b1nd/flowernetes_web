export const WorkloadFields = {
  workloadCreationTime: "workloadCreationTime"
};

export class WorkloadFilter {
  constructor(id, taskId, fromDate, toDate, taskStatus) {
    this.id = id;
    this.taskId = taskId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.taskStatus = taskStatus;
  }
}