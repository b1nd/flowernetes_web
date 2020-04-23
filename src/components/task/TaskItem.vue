<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-row no-gutters align="center">
        <v-col cols="12" sm="11">
          <v-list-item link v-on="on">
            <v-list-item-content>
              <v-list-item-title
                v-text="editableTask.name"
              />
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col
          v-if="isRunTaskAvailable"
          cols="12"
          sm="1"
          class="text-right"
        >
          <v-btn
            icon
            @click="runTask"
          >
            <v-icon color="success">mdi-play</v-icon>
          </v-btn>
          <v-btn
            v-if="!editableTask.scheduled"
            icon
            @click="scheduleTask"
          >
            <v-icon color="warning">mdi-alarm-check</v-icon>
          </v-btn>
          <v-btn
            v-else
            icon
            @click="removeTaskFromSchedule"
          >
            <v-icon color="error">mdi-alarm-off</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" sm="12">
          <v-divider/>
        </v-col>
      </v-row>
    </template>
    <TaskInfo
      @change="onTaskDeleted"
      editable
      v-model="editableTask"
    />
  </v-dialog>
</template>

<script>
  import TaskInfo from "./TaskInfo";
  import taskApi from "../../api/taskApi";
  import {debug} from "../../utils/logging";

  export default {
    name: "TaskItem",
    components: {TaskInfo},
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      task: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        dialog: false,
        editableTask: this.task
      }
    },
    computed: {
      isRunTaskAvailable() {
        return this.$store.getters.isAdmin || this.$store.getters.sessionTeam.id === this.task.workflow.team.id;
      }
    },
    methods: {
      onTaskDeleted(task) {
        this.dialog = false;
        this.$emit("change", task)
      },
      runTask() {
        taskApi.runTask(this.editableTask.id)
          .then(() => {
            debug("runTask", "Task has run", this.task)
          })
      },
      scheduleTask() {
        taskApi.scheduleTask(this.editableTask.id)
          .then(() => {
            debug("scheduleTask", "Task scheduled");
            this.editableTask.scheduled = true;
          })
      },
      removeTaskFromSchedule() {
        taskApi.unscheduleTask(this.editableTask.id)
          .then(() => {
            debug("unscheduleTask", "Task removed from schedule");
            this.editableTask.scheduled = false;
          })
      }
    }
  }
</script>

<style scoped>

</style>