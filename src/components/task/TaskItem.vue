<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-row no-gutters align="center">
        <v-col cols="12" sm="6">
          <v-list-item link v-on="on">
            <v-list-item-content>
              <v-list-item-title
                v-text="editableTask.name"
              />
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col
          cols="12"
          sm="3"
          class="text-right"
        >
          <span :class="taskStatusColor">{{taskStatus}}</span>
        </v-col>
        <v-col
          v-if="isControlTaskAvailable"
          cols="12"
          sm="3"
          class="text-right"
        >
          <v-btn
            :disabled="!isRunTaskAvailable"
            icon
            @click="runTask"
          >
            <v-icon color="success">mdi-play</v-icon>
          </v-btn>
          <v-btn
            :disabled="!isKillTaskAvailable"
            icon
            @click="killTask"
          >
            <v-icon color="error">mdi-close</v-icon>
          </v-btn>
          <v-btn
            v-if="isScheduleTaskAvailable"
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
  import {TaskStatus} from "../../data/dto/task_dto";
  import {TaskStatusColor} from "../../data/constants/task_constants";

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
      },
      statuses: {
        type: Array,
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
      isControlTaskAvailable() {
        return this.$store.getters.isAdmin || this.$store.getters.sessionTeam.id === this.task.workflow.team.id;
      },
      taskStatus() {
        const taskStatusInfo = this.statuses.find(s => s.taskId === this.editableTask.id);
        return taskStatusInfo ? taskStatusInfo.taskStatus : TaskStatus.INACTIVE
      },
      taskStatusColor() {
        return TaskStatusColor[this.taskStatus] + "--text";
      },
      isRunTaskAvailable() {
        return !this.editableTask.scheduled && [
          TaskStatus.ERROR, TaskStatus.INACTIVE, TaskStatus.SUCCESS, TaskStatus.KILLED, TaskStatus.TIME_EXCEEDED
        ].find(status => status === this.taskStatus)
      },
      isKillTaskAvailable() {
        return [
          TaskStatus.RUNNING
        ].find(status => status === this.taskStatus)
      },
      isScheduleTaskAvailable() {
        return !this.editableTask.scheduled || this.taskStatus === TaskStatus.ERROR;
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
      killTask() {
        taskApi.killTask(this.editableTask.id)
          .then(() => {
            debug("killTask", "Task killed", this.task)
          })
      },
      scheduleTask() {
        taskApi.scheduleTask(this.editableTask.id)
          .then(() => {
            debug("scheduleTask", "Task scheduled", this.task);
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