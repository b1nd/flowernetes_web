<template>
  <v-card
    tile
  >
    <v-card-title>
      Workflows
      <v-spacer/>
      <AddWorkflowButton
        @change="addWorkflow"
        v-if="isAddWorkflowAvailable"
      />
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="12" v-if="workflows.length">
          <v-list>
            <v-divider/>
            <v-list-item-group
              v-model="selectedWorkflow"
            >
              <div
                v-for="workflow in workflows"
                :key="workflow.id"
              >
                <v-list-item :value="workflow">
                  <v-list-item-title v-text="workflow.name"/>
                </v-list-item>
                <v-divider/>
              </div>
            </v-list-item-group>
          </v-list>
        </v-col>

        <v-col cols="12" sm="12" v-else>
          <span>There are no workflows</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import AddWorkflowButton from "./AddWorkflowButton";
  import workflowApi from "../../api/workflowApi";
  import {debug} from "../../utils/logging";

  export default {
    name: "WorkflowList",
    components: {AddWorkflowButton},
    data() {
      return {
        workflows: [],
        selectedWorkflow: ""
      }
    },
    computed: {
      isAddWorkflowAvailable() {
        return this.$store.getters.isTeam;
      }
    },
    methods: {
      getWorkflows() {
        workflowApi.getWorkflows().then(response => {
          const allWorkflowsDto = response.data;
          debug("getWorkflows", "allWorkflowsDto", allWorkflowsDto);
          this.workflows = allWorkflowsDto.items;
        })
      },
      addWorkflow(workflow) {
        this.workflows = [...this.workflows, workflow];
      },
      deleteWorkflow(workflow) {
        this.workflows.splice(this.workflows.indexOf(workflow), 1);
      }
    },
    watch: {
      selectedWorkflow(value) {
        this.$emit("input", value);
      }
    },
    beforeMount() {
      this.getWorkflows();
    }
  }
</script>

<style scoped>

</style>