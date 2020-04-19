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
        <v-col cols="12" sm="12" v-if="tasks.length">
          <v-list>
            <v-divider/>
            <TaskItem
              @change="deleteTask"
              v-for="task in tasks"
              :key="task.id"
              :task="task"
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
        tasks: []
      }
    },
    computed: {
      isAddTaskAllowed() {
        return this.$store.getters.isTeam && this.$store.getters.sessionTeam.id === this.workflow.team.id;
      }
    },
    methods: {
      getWorkflowTasks() {
        workflowApi.getWorkflowTasks(this.workflow.id).then(response => {
          const tasks = response.data;
          debug("getWorkflowTasks", "tasks", tasks);
          this.tasks = tasks;
        })
      },
      addTask(task) {
        this.tasks = [task, ...this.tasks];
      },
      deleteTask(task) {
        this.tasks.splice(this.tasks.indexOf(task), 1);
      }
    },
    watch: {
      workflow() {
        this.getWorkflowTasks();
      }
    },
    beforeMount() {
      this.getWorkflowTasks();
    }
  }
</script>

<style scoped>

</style>