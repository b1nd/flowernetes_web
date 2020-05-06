export const SourceScriptDtoFields = {
  id: "id",
  name: "name",
  filename: "filename",
  tag: "tag",
  runFilePath: "runFilePath",
  uploadDate: "uploadDate",
  teamId: "teamId",
  isPublic: "isPublic"
};

export class SourceScriptDto {
  constructor(name, filename, tag, runFilePath, isPublic) {
    this.name = name;
    this.filename = filename;
    this.tag = tag;
    this.runFilePath = runFilePath;
    this.isPublic = isPublic;
  }
}

export function isPyScript(fileName) {
  return fileName.toLowerCase().endsWith(".py")
}

export function isIpynbScript(fileName) {
  return fileName.toLowerCase().endsWith(".ipynb")
}