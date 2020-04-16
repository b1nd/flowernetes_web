<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Workflow info</span>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="name"
              label="Name*"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-checkbox
              v-model="isPublic"
              label="Public"
              flat
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
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";
  import workflowApi from "../../api/workflowApi";
  import {WorkflowDto} from "../../data/dto/workflow_dto";
  import {debug} from "../../utils/logging";

  export default {
    name: "AddWorkflowButton",
    data() {
      return {
        dialog: false,

        name: "",
        isPublic: false
      }
    },
    computed: {
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.name
        ]);
      },
      sessionTeam() {
        return this.$store.getters.sessionTeam;
      }
    },
    methods: {
      close() {
        this.dialog = false;
        this.refreshForm();
      },
      save() {
        workflowApi.addWorkflow(new WorkflowDto(
          this.name,
          this.isPublic,
          this.sessionTeam
        )).then(response => {
          const workflow = response.data;
          debug("addWorkflow", "workflow", workflow);
          this.$emit("change", workflow);
          this.close();
        })
      },
      refreshForm: function () {
        this.name = "";
      }
    }
  }
</script>

<style scoped>

</style>