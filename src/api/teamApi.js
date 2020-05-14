import api from "./api";

const teamsMapping = "/teams";

export default {
  getTeams: () => api.get(teamsMapping),
  getTeamsInfo: () => api.get(`${teamsMapping}/info`),
  addTeam: teamDto => api.put(teamsMapping, teamDto),
  updateTeam: (id, updateTeamDto) => api.patch(`${teamsMapping}/${id}`, updateTeamDto),
  deleteTeam: id => api.delete(`${teamsMapping}/${id}`),
  sessionTeam: () => api.get(`${teamsMapping}/session`),
  teamNamespace: id => api.get(`${teamsMapping}/${id}/namespace`),
  teamCpuUsage: (id, from, to) => api.get(`${teamsMapping}/${id}/cpu`, {
    params: {
      from: from,
      to: to
    }
  }),
  teamRamUsage: (id, from, to) => api.get(`${teamsMapping}/${id}/ram`, {
    params: {
      from: from,
      to: to
    }
  })
}