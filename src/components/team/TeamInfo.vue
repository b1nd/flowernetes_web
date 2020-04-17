<template>
  <v-card tile>
    <v-card-title>
      Team
      <v-spacer/>
      <v-btn
        v-if="editable && !isEditActive"
        icon
        @click="isEditActive = true"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="editable"
        icon
        @click="deleteTeam">
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <ListInfoItems
        v-if="!isEditActive"
        :items="infoItems"
      />
      <v-row no-gutters v-else>
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
    <v-card-actions v-if="isEditActive">
      <v-btn
        color="error"
        text
        @click="cancel"
      >
        Cancel
      </v-btn>
      <v-spacer/>
      <v-btn
        :disabled="!areRequiredFieldsSpecified"
        color="success"
        text
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import namespaceApi from "../../api/namespaceApi";
  import {debug} from "../../utils/logging";
  import ListInfoItems from "../common/ListInfoItems";
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";
  import teamApi from "../../api/teamApi";
  import {UpdateTeamDto} from "../../data/dto/team_dto";

  export default {
    name: "TeamInfo",
    components: {ListInfoItems},
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        isEditActive: false,
        team: this.value,
        name: this.value.name,
        namespace: this.value.namespace.name,
        namespaces: []
      }
    },
    computed: {
      infoItems() {
        return [
          {icon: "", key: "name", value: this.team.name},
          {icon: "", key: "namespace", value: this.team.namespace.name},
          {icon: "", key: "CPU quota", value: `${this.team.namespace.resourceQuota.cpuRequest} cores`},
          {icon: "", key: "CPU limit", value: `${this.team.namespace.resourceQuota.cpuLimit} cores`},
          {icon: "", key: "RAM quota", value: `${this.team.namespace.resourceQuota.memoryRequest} bytes`},
          {icon: "", key: "RAM limit", value: `${this.team.namespace.resourceQuota.memoryLimit} bytes`}
        ]
      },
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.name, this.namespace
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
        teamApi.updateTeam(this.team.id, new UpdateTeamDto(
          this.name,
          this.namespace
        )).then(response => {
          const teamInfoDto = response.data;
          debug("updateTeam", "teamInfoDto:", teamInfoDto);
          this.team = teamInfoDto;
          this.isEditActive = false;
          this.$emit("input", this.team);
        })
      },
      cancel() {
        this.isEditActive = false;
        this.refreshTeam();
      },
      deleteTeam() {
        teamApi.deleteTeam(this.team.id).then(() => {
          debug("deleteTeam", "Successfully delete team:", this.team);
          this.$emit("change", this.team);
        })
      },
      refreshTeam() {
        this.name = this.team.name;
        this.namespace = this.team.namespace.name;
      }
    },
    beforeMount() {
      if (this.editable) {
        this.getNamespaces();
      }
    }
  }
</script>

<style scoped>

</style>