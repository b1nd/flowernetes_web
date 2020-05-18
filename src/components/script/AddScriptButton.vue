<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Script info</span>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="name"
              label="Name*"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="tag"
              label="Tag*"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="runFilePath"
              label="Run file path*"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-checkbox
              v-model="isPublic"
              label="Public"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-file-input
              v-model="file"
              accept=".zip"
              placeholder="Upload script as zip archive"
              label="Script archive"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-progress-linear
          :active="loading"
          indeterminate
          absolute
          bottom
          color="primary"
        />
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
          :disabled="!areRequiredFieldsSpecified || loading"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";
  import {debug} from "../../utils/logging";
  import scriptApi from "../../api/scriptApi";
  import {SourceScriptDto} from "../../data/dto/script_dto";

  export default {
    name: "AddScriptButton",
    data() {
      return {
        dialog: false,
        loading: false,

        name: "",
        tag: "",
        runFilePath: "",
        isPublic: false,
        file: undefined
      }
    },
    computed: {
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.name, this.tag, this.runFilePath, this.file
        ]);
      },
      sessionTeam() {
        return this.$store.getters.sessionTeam;
      }
    },
    methods: {
      close() {
        this.dialog = false;
        this.loading = false;
        this.refreshForm();
      },
      save() {
        this.loading = true;
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("sourceScriptDto", new Blob([JSON.stringify(new SourceScriptDto(
          this.name,
          this.file.name,
          this.tag,
          this.runFilePath,
          this.isPublic
        ))], {
          type: "application/json"
        }));
        scriptApi.addScript(formData).then(response => {
          const sourceScript = response.data;
          debug("addScript", "sourceScript", sourceScript);
          this.$emit("change", sourceScript);
          this.close();
        }).catch(() => {
          this.loading = false;
        });
      },
      refreshForm: function () {
        this.name = "";
        this.tag = "";
        this.runFilePath = "";
        this.isPublic = false;
        this.file = undefined;
      }
    }
  }
</script>

<style scoped>

</style>