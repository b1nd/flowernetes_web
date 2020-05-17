export class TaskDto {
  constructor(
    name,
    workflowId,
    conditions,
    scheduled,
    baseImage,
    timeDeadline,
    maxRetries,
    memoryRequest,
    memoryLimit,
    cpuRequest,
    cpuLimit,
    saveLog,
    saveScript,
    sourceScriptId
  ) {
    this.name = name;
    this.workflowId = workflowId;
    this.conditions = conditions;
    this.scheduled = scheduled;
    this.baseImage = baseImage;
    this.timeDeadline = timeDeadline;
    this.maxRetries = maxRetries;
    this.memoryRequest = memoryRequest;
    this.memoryLimit = memoryLimit;
    this.cpuRequest = cpuRequest;
    this.cpuLimit = cpuLimit;
    this.saveLog = saveLog;
    this.saveScript = saveScript;
    this.sourceScriptId = sourceScriptId;
  }
}

export const ConditionType = {
  TimeCondition: "TimeCondition",
  AndCondition: "AndCondition",
  OrCondition: "OrCondition",
  TaskCondition: "TaskCondition"
};

export class Conditions {
  constructor(timeCondition, logicCondition) {
    this.timeCondition = timeCondition;
    this.logicCondition = logicCondition;
  }
}

export class TimeCondition {
  constructor(time) {
    this.type = ConditionType.TimeCondition;
    this.time = time;
  }
}

export class AndCondition {
  constructor(logicConditions) {
    this.type = ConditionType.AndCondition;
    this.logicConditions = logicConditions;
  }
}

export class OrCondition {
  constructor(logicConditions) {
    this.type = ConditionType.OrCondition;
    this.logicConditions = logicConditions;
  }
}

export class TaskCondition {
  constructor(taskId) {
    this.type = ConditionType.TaskCondition;
    this.taskId = taskId;
  }
}

export const TaskStatus = {
  INACTIVE: "INACTIVE",
  WAITING: "WAITING",
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  KILLED: "KILLED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  TIME_EXCEEDED: "TIME_EXCEEDED",
  ERROR: "ERROR"
};