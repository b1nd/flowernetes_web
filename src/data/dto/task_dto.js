export class TaskDto {
  constructor(
    name,
    workflow,
    condition,
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
    this.baseImage = baseImage;
    this.memoryRequest = memoryRequest;
    this.memoryLimit = memoryLimit;
    this.cpuRequest = cpuRequest;
    this.cpuLimit = cpuLimit;
    this.sourceScriptId = sourceScriptId;
  }
}