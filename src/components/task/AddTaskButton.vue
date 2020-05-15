<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Task info</span>
        <v-spacer/>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="name"
              label="Name*"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-autocomplete
              clearable
              :items="scripts"
              :item-text="scriptSelectionText"
              :item-value="scriptSelectionValue"
              v-model="scriptId"
              label="Script*"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-autocomplete
              clearable
              :items="baseImages"
              v-model="baseImage"
              label="Base image*"
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
          <v-col cols="12" sm="12">
            <v-checkbox
              v-model="scheduled"
              label="Schedule"
              flat
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          text
          @click="close"
        >
          Close
        </v-btn>
        <v-spacer/>
        <v-btn
          color="success"
          text
          @click="save"
          :disabled="!areRequiredFieldsSpecified"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";
  import scriptApi from "../../api/scriptApi";
  import {debug} from "../../utils/logging";
  import taskApi from "../../api/taskApi";
  import {AndCondition, Conditions, OrCondition, TaskCondition, TaskDto, TimeCondition} from "../../data/dto/task_dto";
  import containerizationApi from "../../api/containerizationApi";
  import {isIpynbScript} from "../../data/dto/script_dto";

  export default {
    name: "AddTaskButton",
    props: {
      workflow: {
        type: Object,
        required: true
      },
      availableTasks: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        dialog: false,
        scripts: [],
        baseImages: [],

        name: "",
        scheduled: false,
        baseImage: "",
        cpuRequest: "",
        memoryRequest: "",
        cpuLimit: "",
        memoryLimit: "",
        saveLog: true,
        saveScript: false,
        timeCondition: "",
        andConditions: null,
        orConditions: null,
        scriptId: ""
      }
    },
    computed: {
      isSaveScriptAvailable() {
        const script = this.scripts.find(script => script.id === this.scriptId);
        if (!script) return false;
        return isIpynbScript(script.runFilePath);
      },
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.name, this.baseImage, this.cpuRequest, this.memoryRequest, this.cpuLimit,
          this.memoryLimit, this.scriptId
        ]);
      }
    },
    methods: {
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
      taskSelectionText(task) {
        return task && task.name ? `${task.workflow.name}/${task.name}` : "";
      },
      loadData() {
        this.getSourceScripts();
        this.getBaseImages();
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
      scriptSelectionText: function (script) {
        return `${script.name}:${script.tag}`
      },
      scriptSelectionValue: function (script) {
        return script.id;
      },
      save() {
        taskApi.addTask(new TaskDto(
          this.name,
          this.workflow.id,
          this.conditions(),
          this.scheduled,
          this.baseImage,
          this.memoryRequest,
          this.memoryLimit,
          this.cpuRequest,
          this.cpuLimit,
          this.saveLog,
          this.saveScript,
          this.scriptId
        )).then(response => {
          const task = response.data;
          debug("addTask", "task", task);
          this.$emit("change", task);
          this.close();
        })
      },
      close() {
        this.dialog = false;
        this.refreshForm();
      },
      refreshForm: function () {
        this.name = "";
        this.timeCondition = "";
        this.andConditions = null;
        this.orConditions = null;
        this.baseImage = "";
        this.memoryRequest = "";
        this.memoryLimit = "";
        this.cpuRequest = "";
        this.cpuLimit = "";
        this.saveLog = true;
        this.saveScript = false;
        this.scheduled = false;
        this.scriptId = "";
      }
    },
    watch: {
      dialog(value) {
        if (value) this.loadData();
      },
      isSaveScriptAvailable(value) {
        if (!value) this.saveScript = false
      }
    }
  }
</script>

<style scoped>

</style>