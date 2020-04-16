<template>
  <v-row no-gutters justify="center">
    <v-col cols="12" sm="3">
      <WorkflowList
        @input="onWorkflowSelected"
      />
    </v-col>
    <v-col cols="12" sm="6" v-if="isWorkflowSelected">
      <TaskList
        :workflow="workflow"
      />
    </v-col>
  </v-row>
</template>

<script>
  import WorkflowList from "./WorkflowList";
  import TaskList from "./TaskList";

  export default {
    name: "Workflow",
    components: {TaskList, WorkflowList},
    data() {
      return {
        workflow: undefined
      }
    },
    computed: {
      isWorkflowSelected() {
        return !!this.workflow;
      }
    },
    methods: {
      onWorkflowSelected(workflow) {
        this.workflow = workflow;
      }
    }
  }
</script>

<style scoped>

</style>