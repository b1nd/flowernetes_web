<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Team info</span>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="username"
              label="Username*"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field
              type="password"
              autocomplete="on"
              v-model="password"
              label="Password*"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="name"
              label="Name*"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-autocomplete
              v-model="namespace"
              label="Namespace*"
              :items="namespaces"
              flat
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          text
          @click="close"
        >
          Close
        </v-btn>
        <v-spacer/>
        <v-btn
          color="success"
          text
          @click="save"
          :disabled="!areRequiredFieldsSpecified"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import namespaceApi from "../../api/namespaceApi";
  import {debug} from "../../utils/logging";
  import teamApi from "../../api/teamApi";
  import {TeamDto} from "../../data/dto/team_dto";
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";
  import {Credentials} from "../../data/dto/auth_dto";

  export default {
    name: "AddTeamButton",
    data() {
      return {
        dialog: false,
        namespaces: [],

        name: "",
        namespace: "",
        username: "",
        password: ""
      }
    },
    computed: {
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.name, this.namespace, this.username, this.password
        ]);
      }
    },
    methods: {
      getNamespaces() {
        namespaceApi.getNamespaces().then(response => {
          const namespaceNamesDto = response.data;
          debug("getNamespaces", "namespaceNamesDto:", namespaceNamesDto);
          this.namespaces = namespaceNamesDto.items;
        })
      },
      save() {
        teamApi.addTeam(new TeamDto(
          this.name,
          this.namespace,
          new Credentials(
            this.username,
            this.password
          )
        )).then(response => {
          const teamInfoDto = response.data;
          debug("addTeam", "teamInfoDto:", teamInfoDto);
          this.$emit("change", teamInfoDto);
          this.close();
        })
      },
      close() {
        this.dialog = false;
        this.refreshForm();
      },
      refreshForm: function () {
        this.name = "";
        this.namespace = "";
        this.username = "";
        this.password = "";
      }
    },
    beforeMount() {
      this.getNamespaces();
    }
  }
</script>

<style scoped>

</style>