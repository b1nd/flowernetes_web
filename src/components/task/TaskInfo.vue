<template>
  <v-card tile outlined>
    <v-card-title>
      Task info
      <v-spacer/>
      <v-btn
        v-if="editable && !isEditActive && isEditTaskAvailable"
        icon
        @click="isEditActive = true"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="editable && isEditTaskAvailable"
        icon
        @click="deleteTask"
      >
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row
        v-if="!isEditActive"
        no-gutters
      >
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
                Script: {{scriptHeader}}
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
      <v-row dense v-else>
        <v-col cols="12" sm="12">
          <v-text-field
            v-model="name"
            label="Name*"
            flat
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
            clearable
            :items="scripts"
            :item-text="scriptSelectionText"
            :item-value="scriptSelectionValue"
            v-model="sourceScriptId"
            label="Script*"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
            clearable
            :items="baseImages"
            v-model="baseImage"
            label="Base image*"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="timeDeadline"
            label="Time deadline"
            flat
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="maxRetries"
            label="Retries limit"
            flat
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="cpuRequest"
            label="CPU request*"
            flat
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="cpuLimit"
            label="CPU limit*"
            flat
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="memoryRequest"
            label="Memory request*"
            flat
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="memoryLimit"
            label="Memory limit*"
            flat
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            v-model="timeCondition"
            label="Cron condition"
            flat
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-autocomplete
            v-model="andConditions"
            :items="availableTasks"
            :item-text="taskSelectionText"
            item-value="id"
            clearable
            chips
            small-chips
            label="Strict conditions"
            multiple
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-autocomplete
            v-model="orConditions"
            :items="availableTasks"
            :item-text="taskSelectionText"
            item-value="id"
            clearable
            chips
            small-chips
            label="Alternative conditions"
            multiple
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-checkbox
            v-model="saveLog"
            label="Save log"
            flat
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          v-if="isSaveScriptAvailable"
        >
          <v-checkbox
            v-model="saveScript"
            label="Save output script"
            flat
          />
        </v-col>
      </v-row>

    </v-card-text>
    <v-card-actions v-if="isEditActive">
      <v-btn
        color="error"
        text
        @click="cancel"
      >
        Cancel
      </v-btn>
      <v-spacer/>
      <v-btn
        :disabled="!areRequiredFieldsSpecified"
        color="success"
        text
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {debug} from "../../utils/logging";
  import ListInfoItems from "../common/ListInfoItems";
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";
  import taskApi from "../../api/taskApi";
  import scriptApi from "../../api/scriptApi";
  import ScriptInfo from "../script/ScriptInfo";
  import {
    AndCondition,
    Conditions,
    ConditionType,
    OrCondition,
    TaskCondition,
    TaskDto,
    TimeCondition
  } from "../../data/dto/task_dto";
  import {isIpynbScript} from "../../data/dto/script_dto";
  import containerizationApi from "../../api/containerizationApi";

  export default {
    name: "TaskInfo",
    components: {ScriptInfo, ListInfoItems},
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      value: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        isEditActive: false,
        task: this.value,
        script: undefined,
        scripts: [],
        baseImages: [],

        name: this.value.name,
        scheduled: this.value.scheduled,
        baseImage: this.value.baseImage,
        timeDeadline: this.value.timeDeadline,
        maxRetries: this.value.maxRetries,
        cpuRequest: this.value.cpuRequest,
        memoryRequest: this.value.memoryRequest,
        cpuLimit: this.value.cpuLimit,
        memoryLimit: this.value.memoryLimit,
        saveLog: this.value.saveLog,
        saveScript: this.value.saveScript,
        sourceScriptId: this.value.sourceScriptId,
        timeCondition: "",
        andConditions: [],
        orConditions: []
      }
    },
    computed: {
      isEditTaskAvailable() {
        return this.$store.getters.isTeam;
      },
      availableTasks() {
        return this.$store.getters.availableTasks;
      },
      scriptHeader() {
        return this.script ? `${this.script.name}:${this.script.tag}` : "";
      },
      taskConditions() {
        return JSON.parse(this.task.conditionsJson);
      },
      taskTimeCondition() {
        return this.taskCronCondition ? this.taskCronCondition.time : "";
      },
      taskCronCondition() {
        return this.taskConditions.timeCondition;
      },
      taskLogicCondition() {
        return this.taskConditions.logicCondition;
      },
      taskCronConditionText() {
        return this.taskCronCondition ? this.taskCronCondition.time : "Not specified"
      },
      taskStrictCondition() {
        if (!this.taskLogicCondition) return undefined;

        if (this.taskLogicCondition.type === ConditionType.AndCondition) {
          return this.taskLogicCondition;
        } else if (
          this.taskLogicCondition.type === ConditionType.OrCondition
          && this.taskLogicCondition.logicConditions.length === 2
        ) {
          return this.taskLogicCondition.logicConditions.find(cond => cond.type === ConditionType.AndCondition);
        }
        return undefined;
      },
      taskAlternativeCondition() {
        if (!this.taskLogicCondition) return undefined;

        if (this.taskLogicCondition.type === ConditionType.OrCondition) {
          if (!this.taskLogicCondition.logicConditions.find(cond => cond.type === ConditionType.AndCondition)) {
            return this.taskLogicCondition;
          } else if (this.taskLogicCondition.logicConditions.length === 2) {
            return this.taskLogicCondition.logicConditions.find(cond => cond.type === ConditionType.OrCondition);
          }
        }
        return undefined;
      },
      taskStrictIds() {
        return this.taskStrictCondition ? this.taskStrictCondition.logicConditions.map(cond => cond.taskId) : [];
      },
      taskAlternativeIds() {
        return this.taskAlternativeCondition ? this.taskAlternativeCondition.logicConditions.map(cond => cond.taskId) : [];
      },
      strictConditionsText() {
        return this.taskStrictIds.length ?
          this.taskStrictIds.map(this.getTaskById).map(this.taskToString).join(", ")
          : "Not specified"
      },
      alternativeConditionsText() {
        return this.taskAlternativeIds.length ?
          this.taskAlternativeIds.map(this.getTaskById).map(this.taskToString).join(", ")
          : "Not specified"
      },
      timeDeadlineText() {
        return this.task.timeDeadline ? `${this.task.timeDeadline} seconds` : "Not specified"
      },
      infoItems() {
        return [
          {key: "Id", value: this.task.id},
          {key: "Name", value: this.task.name},
          {key: "Base Image", value: this.task.baseImage},
          {key: "Time deadline", value: this.timeDeadlineText},
          {key: "Retries limit", value: this.task.maxRetries},
          {key: "CPU request", value: `${this.task.cpuRequest} cores`},
          {key: "CPU limit", value: `${this.task.cpuLimit} cores`},
          {key: "Memory request", value: `${this.task.memoryRequest} bytes`},
          {key: "Memory limit", value: `${this.task.memoryLimit} bytes`},
          {key: "Cron condition", value: this.taskCronConditionText},
          {key: "Strict conditions", value: this.strictConditionsText},
          {key: "Alternative conditions", value: this.alternativeConditionsText},
          {key: "Save log", value: this.task.saveLog},
          {key: "Save script", value: this.task.saveScript}
        ]
      },
      isSaveScriptAvailable() {
        const script = this.scripts.find(script => script.id === this.sourceScriptId);
        if (!script) return false;
        return isIpynbScript(script.runFilePath);
      },
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.name, this.baseImage, this.cpuRequest, this.memoryRequest, this.cpuLimit,
          this.memoryLimit, this.sourceScriptId
        ]);
      }
    },
    methods: {
      scriptSelectionText: function (script) {
        return `${script.name}:${script.tag}`
      },
      scriptSelectionValue: function (script) {
        return script.id;
      },
      taskToString(task) {
        return task ? `${task.workflow.name}/${task.name}` : "";
      },
      conditions() {
        const timeCondition = this.timeCondition.trim() ?
          new TimeCondition(this.timeCondition.trim())
          : undefined;
        const andConditions = this.andConditions.length ?
          new AndCondition(this.andConditions.map(taskId => new TaskCondition(taskId)))
          : undefined;
        const orConditions = this.orConditions.length ?
          new OrCondition(this.orConditions.map(taskId => new TaskCondition(taskId)))
          : undefined;
        let logicConditions = null;
        if (andConditions && !orConditions) {
          logicConditions = andConditions
        } else if (orConditions && !andConditions) {
          logicConditions = orConditions
        } else if (andConditions && orConditions) {
          logicConditions = new OrCondition([andConditions, orConditions])
        }
        return new Conditions(
          timeCondition,
          logicConditions
        )
      },
      getSourceScripts() {
        scriptApi.getSessionScripts().then(response => {
          const scripts = response.data;
          debug("getSourceScripts", "scripts", scripts);
          this.scripts = scripts;
        })
      },
      getBaseImages() {
        containerizationApi.getBaseImages().then(response => {
          const baseImagesDto = response.data;
          debug("getBaseImages", "baseImagesDto", baseImagesDto);
          this.baseImages = baseImagesDto.items;
        })
      },
      taskSelectionText(task) {
        return task && task.name ? `${task.workflow.name}/${task.name}` : "";
      },
      getTaskById(id) {
        return this.availableTasks.find(task => task.id === id);
      },
      getTaskSourceScript() {
        scriptApi.getScript(this.task.sourceScriptId).then(response => {
          const sourceScript = response.data;
          debug("getScript", "sourceScript", sourceScript);
          this.script = sourceScript;
        })
      },
      deleteTask() {
        taskApi.deleteTask(this.task.id).then(() => {
          debug("deleteTask", "Task deleted successfully", this.task);
          this.$emit("change", this.task);
        })
      },
      save() {
        taskApi.updateTask(this.task.id, new TaskDto(
          this.name,
          this.task.workflow.id,
          this.conditions(),
          this.scheduled,
          this.baseImage,
          this.timeDeadline,
          this.maxRetries,
          this.memoryRequest,
          this.memoryLimit,
          this.cpuRequest,
          this.cpuLimit,
          this.saveLog,
          this.saveScript,
          this.sourceScriptId
        )).then(response => {
          const task = response.data;
          debug("editTask", "task", task);
          this.task = task;
          this.isEditActive = false;
          this.refreshTask();
          this.$emit("input", this.task);
        })
      },
      cancel() {
        this.isEditActive = false;
        this.refreshTask();
      },
      refreshTask() {
        this.name = this.task.name;
        this.scheduled = this.task.scheduled;
        this.baseImage = this.task.baseImage;
        this.timeDeadline = this.task.timeDeadline;
        this.maxRetries = this.task.maxRetries;
        this.cpuRequest = this.task.cpuRequest;
        this.memoryRequest = this.task.memoryRequest;
        this.cpuLimit = this.task.cpuLimit;
        this.memoryLimit = this.task.memoryLimit;
        this.saveLog = this.task.saveLog;
        this.saveScript = this.task.saveScript;
        this.sourceScriptId = this.task.sourceScriptId;
      }
    },
    beforeMount() {
      this.getTaskSourceScript();
    },
    watch: {
      isEditActive(value) {
        if (value) {
          this.getSourceScripts();
          this.getBaseImages();
        }
        this.timeCondition = this.taskTimeCondition;
        this.andConditions = this.taskStrictIds;
        this.orConditions = this.taskAlternativeIds;
      }
    }
  }
</script>

<style scoped>

</style>