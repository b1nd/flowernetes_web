<template>
  <v-card
    outlined
    tile
    :elevation="1"
  >
    <v-card-title>
      Workflows
      <v-spacer/>
      <AddWorkflowButton
        @change="addWorkflow"
        v-if="isAddWorkflowAvailable"
      />
    </v-card-title>

    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Workflow info</span>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" sm="12">
              <v-text-field
                v-model="editedWorkflow.name"
                label="Name*"
                flat
              />
            </v-col>
            <v-col cols="12" sm="12">
              <v-checkbox
                v-model="editedWorkflow.isPublic"
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
            @click="onClose"
          >
            Close
          </v-btn>
          <v-spacer/>
          <v-btn
            color="success"
            text
            @click="onEditWorkflow"
            :disabled="!areRequiredFieldsSpecified"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-text>
      <v-data-table
        @click:row="selectWorkflow"
        :headers="headers"
        :items="workflows"
        multi-sort
        single-select
        :items-per-page="15"
      >
        <template v-slot:item.name="{ item }">
          <WorkflowItem :workflow="item"/>
        </template>

        <template v-slot:item.isPublic="{ item }">
          <v-icon v-if="item.isPublic">mdi-lock-open</v-icon>
          <v-icon v-else>mdi-lock</v-icon>
        </template>

        <template v-slot:item.actions="{ item }">
          <div v-if="isEditWorkflowAvailable(item)">

            <v-btn
              icon
              @click="onEditWorkflowClick(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              icon
              @click="deleteWorkflow(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import AddWorkflowButton from "./AddWorkflowButton";
  import workflowApi from "../../api/workflowApi";
  import {debug} from "../../utils/logging";
  import WorkflowItem from "./WorkflowItem";
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";
  import {WorkflowDto} from "../../data/dto/workflow_dto";

  export default {
    name: "WorkflowList",
    components: {WorkflowItem, AddWorkflowButton},
    data() {
      return {
        actionClicked: false,
        dialog: false,
        editedWorkflow: {},
        workflows: [],
        selectedWorkflow: undefined,
        headers: [
          {text: "Name", value: "name"},
          {text: "Public", value: "isPublic", align: "center"},
          {text: "Actions", value: "actions", align: "right", sortable: false}
        ]
      }
    },
    computed: {
      isAddWorkflowAvailable() {
        return this.$store.getters.isTeam;
      },
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.editedWorkflow.name
        ]);
      }
    },
    methods: {
      selectWorkflow(workflow, row) {
        if (!this.actionClicked) {
          row.select(true);
          this.selectedWorkflow = workflow;
        }
      },
      isEditWorkflowAvailable(workflow) {
        return this.$store.getters.isTeam && this.$store.getters.sessionTeam &&
          this.$store.getters.sessionTeam.id === workflow.team.id;
      },
      getWorkflows() {
        workflowApi.getWorkflows().then(response => {
          const allWorkflowsDto = response.data;
          debug("getWorkflows", "allWorkflowsDto", allWorkflowsDto);
          this.workflows = allWorkflowsDto.items;
        })
      },
      onEditWorkflowClick(workflow) {
        this.dialog = true;
        this.editedWorkflow = Object.assign({}, workflow);
      },
      onClose() {
        this.dialog = false;
      },
      onEditWorkflow() {
        workflowApi.updateWorkflow(
          this.editedWorkflow.id,
          new WorkflowDto(
            this.editedWorkflow.name,
            this.editedWorkflow.isPublic,
            this.editedWorkflow.team
          )
        ).then(response => {
          const newWorkflow = response.data;
          debug("updateWorkflow", "newWorkflow", newWorkflow);
          const oldWorkflow = this.workflows.find(wf => wf.id === newWorkflow.id);
          this.workflows.splice(this.workflows.indexOf(oldWorkflow), 1);
          this.$nextTick().then(() => {
            this.workflows = [...this.workflows, newWorkflow];
          });
          if (this.selectedWorkflow === oldWorkflow) {
            this.selectedWorkflow = newWorkflow;
          }
          this.dialog = false;
        })
      },
      addWorkflow(workflow) {
        this.workflows = [...this.workflows, workflow];
      },
      deleteWorkflow(workflow) {
        this.actionClicked = true;
        workflowApi.deleteWorkflow(workflow.id).then(() => {
          debug("deleteWorkflow", "workflow deleted", workflow);
          if (this.selectedWorkflow === workflow) {
            this.selectedWorkflow = null;
          }
          this.workflows.splice(this.workflows.indexOf(workflow), 1);
          this.actionClicked = false;
        }).catch(() => {
          this.actionClicked = false;
        });
      }
    },
    watch: {
      selectedWorkflow(value) {
        this.$emit("input", value);
      },
      dialog(value) {
        this.actionClicked = value;
      }
    },
    beforeMount() {
      this.getWorkflows();
    }
  }
</script>

<style scoped>

</style>