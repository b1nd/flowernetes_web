<template>
  <v-card tile>
    <v-card-title>
      Workload
    </v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <v-expansion-panels accordion tile flat hover>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span class="subtitle-1">Task: {{taskHeader}}</span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <TaskInfo
                  :value="workload.task"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12" sm="12">
          <ListInfoItems
            :cols="3"
            :items="infoItems"
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-expansion-panels accordion tile flat hover>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Running script: {{scriptHeader}}
              </v-expansion-panel-header>
              <v-expansion-panel-content
                v-if="script"
              >
                <ScriptInfo
                  :value="script"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import ListInfoItems from "../common/ListInfoItems";
  import ScriptInfo from "../script/ScriptInfo";
  import scriptApi from "../../api/scriptApi";
  import {debug} from "../../utils/logging";
  import TaskInfo from "../task/TaskInfo";
  import {TaskStatusColor} from "../../data/constants/task_constants";

  export default {
    name: "WorkloadInfo",
    components: {TaskInfo, ScriptInfo, ListInfoItems},
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        workload: this.value,
        script: undefined
      }
    },
    computed: {
      taskHeader() {
        return this.workload.task.name;
      },
      scriptHeader() {
        return this.script ? `${this.script.name}:${this.script.tag}` : "";
      },
      infoItems() {
        return [
          {icon: "", key: "Trigger time", value: this.workload.workloadCreationTime},
          {icon: "", key: "Workload status", value: this.workload.taskStatus, color: TaskStatusColor[this.workload.taskStatus]},
          {icon: "", key: "Task start time", value: this.workload.taskStartTime},
          {icon: "", key: "Task completion time", value: this.workload.taskCompletionTime},
          {icon: "", key: "Running base image", value: this.workload.baseImage},
          {icon: "", key: "CPU request", value: `${this.workload.cpuRequest} cores`},
          {icon: "", key: "CPU limit", value: `${this.workload.cpuLimit} cores`},
          {icon: "", key: "Memory request", value: `${this.workload.memoryRequest} bytes`},
          {icon: "", key: "Memory limit", value: `${this.workload.memoryLimit} bytes`}
        ]
      }
    },
    methods: {
      getTaskSourceScript() {
        scriptApi.getScript(this.workload.sourceScriptId).then(response => {
          const sourceScript = response.data;
          debug("getScript", "sourceScript", sourceScript);
          this.script = sourceScript;
        })
      }
    },
    beforeMount() {
      this.getTaskSourceScript();
    }
  }
</script>

<style scoped>

</style>