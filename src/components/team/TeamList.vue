<template>
  <v-card
    tile
  >
    <v-card-title>
      Teams
      <v-spacer/>
      <AddTeamButton
        @change="addTeam"
      />
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="12"
          v-if="teams.length"
        >
          <v-list>
            <v-divider/>
            <TeamItem
              @change="deleteTeam"
              editable
              v-for="team in teams"
              :key="team.id"
              :team="team"
            />
          </v-list>
        </v-col>

        <v-col cols="12" sm="12" v-else>
          <span>There are no teams</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import teamApi from "../../api/teamApi";
  import {debug} from "../../utils/logging";
  import AddTeamButton from "./AddTeamButton";
  import TeamItem from "./TeamItem";

  export default {
    name: "TeamList",
    components: {TeamItem, AddTeamButton},
    data() {
      return {
        teams: []
      }
    },
    methods: {
      getTeams() {
        teamApi.getTeams().then(response => {
          const allTeamsInfoDto = response.data;
          debug("getTeams", "allTeamsInfoDto:", allTeamsInfoDto);
          this.teams = allTeamsInfoDto.items;
        })
      },
      addTeam(team) {
        this.teams = [...this.teams, team];
      },
      deleteTeam(team) {
        this.teams.splice(this.teams.indexOf(team), 1);
      }
    },
    beforeMount() {
      this.getTeams();
    }
  }
</script>

<style scoped>

</style>