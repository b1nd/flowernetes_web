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
      <v-row>
        <v-col cols="12" sm="12" v-if="tasks.length && tasksStatusInfo.length">
          <v-list>
            <v-divider/>
            <TaskItem
              @change="deleteTask"
              v-for="task in tasks"
              :key="task.id"
              :task="task"
              :statuses="tasksStatusInfo"
            />
          </v-list>
        </v-col>

        <v-col cols="12" sm="12" v-else>
          <span>There are no tasks in workflow {{workflow.name}}</span>
        </v-col>
      </v-row>
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
  import {UPDATE_AVAILABLE_TASKS} from "../../data/constants/task_constants";

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
        tasksStatusInfo: []
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
      getWorkflowTasks() {
        workflowApi.getWorkflowTasks(this.workflow.id).then(response => {
          const tasks = response.data;
          debug("getWorkflowTasks", "tasks", tasks);
          this.tasks = tasks;
        })
      },
      getWorkflowTaskStatuses() {
        workflowApi.getWorkflowTasksStatusInfo(this.workflow.id).then(response => {
          const tasksStatusInfo = response.data;
          debug("getWorkflowTasksStatusInfo", "tasksStatusInfo", tasksStatusInfo);
          tasksStatusInfo.forEach(this.onNewTaskStatusInfo);
        })
      },
      addTask(task) {
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
      onNewTaskStatusInfo(newStatus) {
        const oldStatus = this.tasksStatusInfo.find(s => s.taskId === newStatus.taskId);
        if (oldStatus) {
          if (newStatus.lastTransitionTime >= oldStatus.lastTransitionTime) {
            this.tasksStatusInfo.splice(this.tasksStatusInfo.indexOf(oldStatus), 1, newStatus);
          }
        } else {
          this.tasksStatusInfo.push(newStatus);
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