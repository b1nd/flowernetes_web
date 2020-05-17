<template>
  <v-card tile>
    <v-card-title>
      Workload
      <v-spacer/>
      <v-btn
        v-if="isDownloadLogAvailable"
        :disabled="downloadLogActive"
        icon
        @click="downloadLog"
      >
        <v-icon>mdi-text-subject</v-icon>
      </v-btn>
      <v-btn
        v-if="isDownloadOutputScriptAvailable"
        :disabled="downloadOutputScriptActive"
        icon
        @click="downloadOutputScript"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
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

      <v-progress-linear
        :active="downloadLogActive || downloadOutputScriptActive"
        indeterminate
        absolute
        bottom
        color="primary"
      />
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
  import workloadApi from "../../api/workloadApi";
  import {saveAs} from "file-saver";
  import {getFileNameFromHeader} from "../../api/api";
  import {TaskStatus} from "../../data/dto/task_dto";

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
        downloadLogActive: false,
        downloadOutputScriptActive: false,
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
          {key: "Workload Id", value: this.workload.id},
          {key: "Trigger time", value: this.workload.workloadCreationTime},
          {key: "Workload status", value: this.workload.taskStatus, color: TaskStatusColor[this.workload.taskStatus]},
          {key: "Task start time", value: this.workload.taskStartTime},
          {key: "Task completion time", value: this.workload.taskCompletionTime},
          {key: "Running base image", value: this.workload.baseImage},
          {key: "CPU request", value: `${this.workload.cpuRequest} cores`},
          {key: "CPU limit", value: `${this.workload.cpuLimit} cores`},
          {key: "Memory request", value: `${this.workload.memoryRequest} bytes`},
          {key: "Memory limit", value: `${this.workload.memoryLimit} bytes`}
        ]
      },
      isDownloadLogAvailable() {
        return this.workload.task.saveLog &&
          (this.workload.taskStatus === TaskStatus.SUCCESS || this.workload.taskStatus === TaskStatus.ERROR)
      },
      isDownloadOutputScriptAvailable() {
        return this.workload.task.saveScript && this.workload.taskStatus === TaskStatus.SUCCESS
      }
    },
    methods: {
      getTaskSourceScript() {
        scriptApi.getScript(this.workload.sourceScriptId).then(response => {
          const sourceScript = response.data;
          debug("getScript", "sourceScript", sourceScript);
          this.script = sourceScript;
        })
      },
      downloadLog() {
        this.downloadLogActive = true;
        workloadApi.downloadLogFile(this.workload.id).then(response => {
          const fileName = getFileNameFromHeader(response);
          saveAs(response.data, fileName);
          this.downloadLogActive = false;
        });
      },
      downloadOutputScript() {
        this.downloadOutputScriptActive = true;
        workloadApi.downloadOutputFile(this.workload.id).then(response => {
          const fileName = getFileNameFromHeader(response);
          saveAs(response.data, fileName);
          this.downloadOutputScriptActive = false;
        });
      }
    },
    beforeMount() {
      this.getTaskSourceScript();
    }
  }
</script>

<style scoped>

</style>