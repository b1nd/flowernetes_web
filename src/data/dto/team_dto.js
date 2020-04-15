export class TeamDto {
  constructor(name, namespace, credentials) {
    this.name = name;
    this.namespace = namespace;
    this.credentials = credentials;
  }
}

export class UpdateTeamDto {
  constructor(name, namespace) {
    this.name = name;
    this.namespace = namespace;
  }
}