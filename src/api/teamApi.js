import api from "./api";

const teamsMapping = "/teams";

export default {
  getTeams: () => api.get(teamsMapping),
  addTeam: teamDto => api.put(teamsMapping, teamDto),
  updateTeam: (id, updateTeamDto) => api.patch(`${teamsMapping}/${id}`, updateTeamDto),
  deleteTeam: id => api.delete(`${teamsMapping}/${id}`),
  sessionTeam: () => api.get(`${teamsMapping}/session`)
}