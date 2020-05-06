export class WorkflowDto {
  constructor(name, isPublic, team) {
    this.name = name;
    this.isPublic = isPublic;
    this.team = team;
  }
}

export const TopicPath = {
  WORKFLOW: "/topic/workflow"
};