<template>
  <v-card tile outlined>
    <v-card-title>
      Script info
      <v-spacer/>
      <v-btn
        :disabled="downloadActive"
        icon
        @click="downloadScript"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
      <v-btn
        v-if="editable"
        icon
        @click="deleteScript"
      >
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <ListInfoItems
        v-if="!isEditActive"
        :items="infoItems"
      />
      <v-row no-gutters v-else>
      </v-row>

      <v-progress-linear
        :active="downloadActive"
        indeterminate
        absolute
        bottom
        color="primary"
      />
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
  import ListInfoItems from "../common/ListInfoItems";
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";
  import scriptApi from "../../api/scriptApi";
  import {saveAs} from 'file-saver';
  import {debug} from "../../utils/logging";
  import {fullDate} from "../../utils/date";

  export default {
    name: "ScriptInfo",
    components: {ListInfoItems},
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
        script: this.value,
        downloadActive: false
      }
    },
    computed: {
      infoItems() {
        return [
          {key: "Name", value: this.script.name},
          {key: "Tag", value: this.script.tag},
          {key: "Public", value: this.script.isPublic},
          {key: "File name", value: this.script.filename},
          {key: "Run file path", value: this.script.runFilePath},
          {key: "Upload date", value: this.formatDate(this.script.uploadDate)}
        ]
      },
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([]);
      }
    },
    methods: {
      formatDate(date) {
        return fullDate(date);
      },
      downloadScript() {
        this.downloadActive = true;
        scriptApi.downloadScript(this.script.id).then(response => {
          saveAs(response.data, this.script.filename);
          this.downloadActive = false;
        });
      },
      deleteScript() {
        scriptApi.deleteScript(this.script.id).then(() => {
          debug("deleteScript", "Script deleted successfully", this.script);
          this.$emit("change", this.script);
        });
      },
      save() {
      },
      cancel() {
        this.isEditActive = false;
        this.refreshScript();
      },
      refreshScript() {
      }
    }
  }
</script>

<style scoped>

</style>