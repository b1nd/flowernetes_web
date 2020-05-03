export class TaskDto {
  constructor(
    name,
    workflow,
    conditions,
    scheduled,
    baseImage,
    memoryRequest,
    memoryLimit,
    cpuRequest,
    cpuLimit,
    saveLog,
    saveScript,
    sourceScriptId
  ) {
    this.name = name;
    this.workflow = workflow;
    this.conditions = conditions;
    this.scheduled = scheduled;
    this.baseImage = baseImage;
    this.memoryRequest = memoryRequest;
    this.memoryLimit = memoryLimit;
    this.cpuRequest = cpuRequest;
    this.cpuLimit = cpuLimit;
    this.saveLog = saveLog;
    this.saveScript = saveScript;
    this.sourceScriptId = sourceScriptId;
  }
}

export const TaskStatus = {
  WAITING: "WAITING",
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
};

export function isPyScript(fileName) {
  return fileName.toLowerCase().endsWith(".py")
}

export function isIpynbScript(fileName) {
  return fileName.toLowerCase().endsWith(".ipynb")
}