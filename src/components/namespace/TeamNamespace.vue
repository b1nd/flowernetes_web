<template>
  <v-row dense>
    <v-col cols="12" sm="12">
      <v-toolbar dense elevation="1">
        <v-toolbar-title>
          Team:
        </v-toolbar-title>

        <v-toolbar-items>
          <v-select
            v-model="selectedTeam"
            item-text="name"
            :item-value="v => v"
            solo
            flat
            :items="teams"
          >
            <template v-slot:label>
              <span class="selector-label subtitle-1">select team</span>
            </template>
            <template v-slot:selection>
              <span class="title">{{selectedTeam.name}}</span>
            </template>
          </v-select>
        </v-toolbar-items>
      </v-toolbar>
    </v-col>
    <v-col cols="12" sm="12">
      <v-card>
        <v-card-text v-if="selectedTeam">
          <TeamResourceUsage
            :team="selectedTeam"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import TeamResourceUsage from "./TeamResourceUsage";
  import {debug} from "../../utils/logging";
  import teamApi from "../../api/teamApi";

  export default {
    name: "TeamNamespace",
    components: {TeamResourceUsage},
    data() {
      return {
        teams: [],
        selectedTeam: null
      }
    },
    methods: {
      getTeams() {
        teamApi.getTeams().then(response => {
          const allTeamsDto = response.data;
          debug("getTeams", "allTeamsDto", allTeamsDto);
          this.teams = allTeamsDto.items;
        })
      }
    },
    beforeMount() {
      this.getTeams();
    }
  }
</script>

<style scoped>
  .selector-label {
    line-height: 1.3em;
  }
</style>