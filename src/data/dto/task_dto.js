export class TaskDto {
  constructor(name, workflow, condition, baseImage, sourceScriptId) {
    this.name = name;
    this.workflow = workflow;
    this.condition = condition;
    this.baseImage = baseImage;
    this.sourceScriptId = sourceScriptId;
  }
}