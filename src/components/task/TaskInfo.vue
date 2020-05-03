<template>
  <v-card tile outlined>
    <v-card-title>
      Task info
      <v-spacer/>
      <v-btn
        v-if="editable && !isEditActive"
        icon
        @click="isEditActive = true"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="editable"
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
      <v-row no-gutters v-else>
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
        script: undefined
      }
    },
    computed: {
      scriptHeader() {
        return this.script ? `${this.script.name}:${this.script.tag}` : "";
      },
      infoItems() {
        return [
          {key: "Name", value: this.task.name},
          {key: "Base Image", value: this.task.baseImage},
          {key: "CPU request", value: `${this.task.cpuRequest} cores`},
          {key: "CPU limit", value: `${this.task.cpuLimit} cores`},
          {key: "Memory request", value: `${this.task.memoryRequest} bytes`},
          {key: "Memory limit", value: `${this.task.memoryLimit} bytes`},
          {key: "Save log", value: this.task.saveLog},
          {key: "Save script", value: this.task.saveScript},
          {key: "Condition", value: this.task.conditionsJson}
        ]
      },
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([]);
      }
    },
    methods: {
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
        }).catch(error => {
          // todo: show snackbar?
          throw error;
        });
      },
      save() {
      },
      cancel() {
        this.isEditActive = false;
        this.refreshTask();
      },
      refreshTask() {
      }
    },
    beforeMount() {
      this.getTaskSourceScript();
    }
  }
</script>

<style scoped>

</style>