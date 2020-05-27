<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-list-item link v-on="on" class="pa-0">
        <v-list-item-content>
          {{title}}
        </v-list-item-content>
      </v-list-item>
    </template>
    <WorkloadInfo
      v-if="dialog"
      v-model="workload"
    />
  </v-dialog>
</template>

<script>
  import WorkloadInfo from "./WorkloadInfo";

  export default {
    name: "WorkloadItem",
    components: {WorkloadInfo},
    props: {
      workload: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        dialog: false
      }
    },
    computed: {
      title() {
        return this.taskSelectionText(this.workload.task);
      }
    },
    methods: {
      taskSelectionText(task) {
        return task && task.name ? `${task.workflow.name}/${task.name}` : "";
      }
    }
  }
</script>

<style scoped>

</style>