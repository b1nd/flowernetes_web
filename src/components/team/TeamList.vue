<template>
  <v-card tile>
    <v-card-title>
      Teams
      <v-spacer/>
      <AddTeamButton
        @change="addTeam"
      />
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="teams"
        multi-sort
        :items-per-page="-1"
      >
        <template v-slot:item.name="{ item }">
          <TeamItem
            @input="getTeamsInfo"
            @change="deleteTeam"
            editable
            :team="item"
          />
        </template>
      </v-data-table>
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
        teams: [],
        headers: [
          {text: "Id", value: "id"},
          {text: "Name", value: "name"},
          {text: "Namespace", value: "namespace.name"}
        ]
      }
    },
    methods: {
      getTeamsInfo() {
        teamApi.getTeamsInfo().then(response => {
          const allTeamsInfoDto = response.data;
          debug("getTeamsInfo", "allTeamsInfoDto:", allTeamsInfoDto);
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
      this.getTeamsInfo();
    }
  }
</script>

<style scoped>

</style>