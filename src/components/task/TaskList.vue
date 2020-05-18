<template>
  <v-card
    tile
    outlined
  >
    <v-card-title>
      {{workflow.name}} tasks
      <v-spacer/>
      <AddTaskButton
        @change="addTask"
        :workflow="workflow"
        v-if="isAddTaskAllowed"
      />
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="tasks"
        multi-sort
        :items-per-page="-1"
      >
        <template v-slot:item.name="{ item }">
          <TaskItem
            @change="deleteTask"
            editable
            :task="item"
          />
        </template>
        <template v-slot:item.status="{ item }">
          <span :class="taskStatusColor(item)">{{item.status}}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <div v-if="isControlTaskAvailable(item)">

            <v-btn
              :disabled="!isRunTaskAvailable(item)"
              icon
              @click="runTask(item)"
            >
              <v-icon color="success">mdi-play</v-icon>
            </v-btn>

            <v-btn
              :disabled="!isKillTaskAvailable(item)"
              icon
              @click="killTask(item)"
            >
              <v-icon color="error">mdi-close</v-icon>
            </v-btn>

            <v-btn
              v-if="isScheduleTaskAvailable(item)"
              icon
              @click="scheduleTask(item)"
            >
              <v-icon color="warning">mdi-alarm-check</v-icon>
            </v-btn>

            <v-btn
              v-else
              icon
              @click="removeTaskFromSchedule(item)"
            >
              <v-icon color="error">mdi-alarm-off</v-icon>
            </v-btn>

          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import AddTaskButton from "./AddTaskButton";
  import workflowApi from "../../api/workflowApi";
  import {debug} from "../../utils/logging";
  import TaskItem from "./TaskItem";
  import {newStompClient} from "../../api/stomp";
  import {TopicPath} from "../../data/dto/workflow_dto";
  import {TaskStatusColor, UPDATE_AVAILABLE_TASKS} from "../../data/constants/task_constants";
  import {TaskStatus} from "../../data/dto/task_dto";
  import taskApi from "../../api/taskApi";

  export default {
    name: "TaskList",
    components: {TaskItem, AddTaskButton},
    props: {
      workflow: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        stomp: null,

        tasks: [],
        totalItems: 0,
        loading: true,
        tasksStatusInfo: {},
        headers: [
          {text: "Id", value: "id"},
          {text: "Name", value: "name"},
          {text: "Status", value: "status", align: "right", sortable: false},
          {text: "Actions", value: "actions", align: "right", sortable: false}
        ]
      }
    },
    computed: {
      isAddTaskAllowed() {
        return this.$store.getters.isTeam && this.$store.getters.sessionTeam.id === this.workflow.team.id;
      }
    },
    methods: {
      async getAvailableTasks() {
        await this.$store.dispatch(UPDATE_AVAILABLE_TASKS);
      },
      taskStatusColor(task) {
        return TaskStatusColor[task.status] + "--text";
      },
      isControlTaskAvailable(task) {
        return this.$store.getters.isAdmin || this.$store.getters.sessionTeam.id === task.workflow.team.id;
      },
      isRunTaskAvailable(task) {
        return !task.scheduled && [
          TaskStatus.SUCCESS, TaskStatus.ERROR, TaskStatus.INACTIVE, TaskStatus.KILLED, TaskStatus.TIME_EXCEEDED
        ].find(status => status === task.status)
      },
      isKillTaskAvailable(task) {
        return [
          TaskStatus.RUNNING, TaskStatus.PENDING
        ].find(status => status === task.status)
      },
      isScheduleTaskAvailable(task) {
        return !task.scheduled || task.status === TaskStatus.ERROR;
      },
      runTask(task) {
        taskApi.runTask(task.id)
          .then(() => {
            debug("runTask", "Task has run", task)
          })
      },
      killTask(task) {
        taskApi.killTask(task.id)
          .then(() => {
            debug("killTask", "Task killed", task)
          })
      },
      scheduleTask(task) {
        taskApi.scheduleTask(task.id)
          .then(() => {
            debug("scheduleTask", "Task scheduled", task);
            task.scheduled = true;
          })
      },
      removeTaskFromSchedule(task) {
        taskApi.unscheduleTask(task.id)
          .then(() => {
            debug("unscheduleTask", "Task removed from schedule", task);
            task.scheduled = false;
          })
      },
      async getWorkflowTasks() {
        await workflowApi.getWorkflowTasks(this.workflow.id).then(response => {
          const tasks = response.data;
          debug("getWorkflowTasks", "tasks", tasks);
          tasks.forEach(this.setTaskStatus);
          this.tasks = tasks;
        })
      },
      getTaskStatus(task) {
        const taskStatusInfo = this.tasksStatusInfo[task.id];
        return taskStatusInfo ? taskStatusInfo.taskStatus : TaskStatus.INACTIVE;
      },
      setTaskStatus(task) {
        task["status"] = this.getTaskStatus(task);
      },
      getWorkflowTaskStatuses() {
        workflowApi.getWorkflowTasksStatusInfo(this.workflow.id).then(response => {
          const tasksStatusInfo = response.data;
          debug("getWorkflowTasksStatusInfo", "tasksStatusInfo", tasksStatusInfo);
          tasksStatusInfo.forEach(this.onNewTaskStatusInfo);
        })
      },
      addTask(task) {
        this.setTaskStatus(task);
        this.tasks = [task, ...this.tasks];
        this.getAvailableTasks();
      },
      deleteTask(task) {
        this.tasks.splice(this.tasks.indexOf(task), 1);
        this.getAvailableTasks();
      },
      subscribeOnUpdates() {
        this.stomp = newStompClient();
        this.stomp.connect({}, () => {
          debug("Stomp connected");
          this.stomp.subscribe(`${TopicPath.WORKFLOW}/${this.workflow.id}`, frame => {
            const taskStatusInfo = JSON.parse(frame.body);
            debug("New taskStatusInfo:", taskStatusInfo);
            this.onNewTaskStatusInfo(taskStatusInfo);
          });
        });
      },
      updateTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && this.tasksStatusInfo[taskId]) {
          task["status"] = this.tasksStatusInfo[taskId].taskStatus;
        }
      },
      onNewTaskStatusInfo(newStatus) {
        const oldStatus = this.tasksStatusInfo[newStatus.taskId];
        if (oldStatus) {
          if (newStatus.lastTransitionTime >= oldStatus.lastTransitionTime) {
            this.tasksStatusInfo[newStatus.taskId] = newStatus;
            this.updateTaskStatus(newStatus.taskId);
          }
        } else {
          this.tasksStatusInfo[newStatus.taskId] = newStatus;
          this.updateTaskStatus(newStatus.taskId);
        }
      },
      closeConnection() {
        this.stomp.disconnect();
      }
    },
    watch: {
      workflow() {
        this.getWorkflowTasks();
      }
    },
    beforeMount() {
      this.getAvailableTasks().then(() => this.getWorkflowTasks());
      this.subscribeOnUpdates();
      this.getWorkflowTaskStatuses();
    },
    destroyed() {
      this.closeConnection();
    }
  }
</script>

<style scoped>

</style>