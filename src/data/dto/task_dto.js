export class TaskDto {
  constructor(
    name,
    workflow,
    condition,
    schedule,
    baseImage,
    memoryRequest,
    memoryLimit,
    cpuRequest,
    cpuLimit,
    sourceScriptId
  ) {
    this.name = name;
    this.workflow = workflow;
    this.condition = condition;
    this.schedule = schedule;
    this.baseImage = baseImage;
    this.memoryRequest = memoryRequest;
    this.memoryLimit = memoryLimit;
    this.cpuRequest = cpuRequest;
    this.cpuLimit = cpuLimit;
    this.sourceScriptId = sourceScriptId;
  }
}