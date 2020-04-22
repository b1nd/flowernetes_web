<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <div>
        <v-list-item link v-on="on">
          <v-list-item-content>
            <v-list-item-title>{{title}}</v-list-item-title>
            <v-list-item-subtitle>Trigger time: {{triggerTime}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>
              <span class="subtitle-2" :class="statusColor">{{statusText}}</span>
            </v-list-item-action-text>
            <v-list-item-action-text>
              <span class="subtitle-2">{{taskStartTime}}</span>
            </v-list-item-action-text>
            <v-list-item-action-text>
              <span class="subtitle-2">{{taskCompletionTime}}</span>
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-divider/>
      </div>
    </template>
    <WorkloadInfo
      v-if="dialog"
      v-model="editableWorkload"
    />
  </v-dialog>
</template>

<script>
  import WorkloadInfo from "./WorkloadInfo";
  import {TaskStatusColor} from "../../data/constants/task_constants";

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
        dialog: false,
        editableWorkload: this.workload
      }
    },
    computed: {
      title() {
        return this.editableWorkload.task.name;
      },
      triggerTime() {
        return this.editableWorkload.workloadCreationTime;
      },
      taskStartTime() {
        return this.editableWorkload.taskStartTime;
      },
      taskCompletionTime() {
        return this.editableWorkload.taskCompletionTime;
      },
      statusText() {
        return this.editableWorkload.taskStatus;
      },
      statusColor() {
        return TaskStatusColor[this.editableWorkload.taskStatus] + "--text";
      }
    }
  }
</script>

<style scoped>

</style>