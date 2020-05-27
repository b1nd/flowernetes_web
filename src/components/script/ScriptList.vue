<template>
  <v-card tile>
    <v-card-title>
      <v-row dense class="align-center">
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="selectedScriptId"
            label="Id"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="5">
          <v-combobox
            v-model="selectedScriptName"
            label="Name"
            :items="availableScriptsNames"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-text-field
            v-model="selectedScriptTag"
            clearable
            label="Tag"
            hide-details
          />
        </v-col>
        <v-col cols="12" xl="1" sm="2" class="text-center">
          <v-btn
            outlined
            @click="refreshFirstPage"
          >
            apply
            <v-icon class="ml-1">mdi-magnify</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" xl="2" sm="1" class="text-right">
          <AddScriptButton
            @change="addScript"
            v-if="isAddScriptAvailable"
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        multi-sort
        :options.sync="options"
        :items-per-page="itemsPerPage"
        :server-items-length="totalItems"
        :loading="loading"
      >
        <template v-slot:item.name="{ item }">
          <ScriptItem
            :script="item"
            editable
            @change="deleteScript"
          />
        </template>

        <template v-slot:item.uploadDate="{ item }">
          <span>{{formatDate(item.uploadDate)}}</span>
        </template>

        <template v-slot:item.isPublic="{ item }">
          <v-simple-checkbox v-model="item.isPublic" disabled/>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import AddScriptButton from "./AddScriptButton";
  import scriptApi from "../../api/scriptApi"
  import ScriptItem from "./ScriptItem";
  import {debug} from "../../utils/logging";
  import {Direction} from "../../data/dto/pagination_dto";
  import {SourceScriptDtoFields, SourceScriptFilter} from "../../data/dto/script_dto";
  import {fullDate} from "../../utils/date";

  export default {
    name: "ScriptList",
    components: {ScriptItem, AddScriptButton},
    props: {
      baseItemsPerPage: {
        type: Number,
        default: 15
      },
      baseProperties: {
        type: Array,
        default() {
          return [
            SourceScriptDtoFields.uploadDate
          ]
        }
      },
      baseDirections: {
        type: Array,
        default() {
          return [
            Direction.DESCENDING
          ]
        }
      }
    },
    data() {
      return {
        availableScriptsNames: [],
        itemsPerPage: this.baseItemsPerPage,
        properties: this.baseProperties,
        directions: this.baseDirections,
        items: [],
        selectedScriptId: null,
        selectedScriptName: null,
        selectedScriptTag: null,
        totalItems: 0,
        totalPages: 1,
        loading: true,
        options: {},
        headers: [
          {text: "Id", value: "id"},
          {text: "Name", value: "name"},
          {text: "Tag", value: "tag"},
          {text: "Upload Date", value: "uploadDate"},
          {text: "Public", value: "isPublic"}
        ]
      }
    },
    computed: {
      isAddScriptAvailable() {
        return this.$store.getters.isTeam;
      },
      isTeam() {
        return this.$store.getters.isTeam;
      }
    },
    methods: {
      formatDate(date) {
        return fullDate(date);
      },
      getSourceScripts() {
        if (this.isTeam) {
          scriptApi.getSessionScripts().then(response => {
            const availableScripts = response.data;
            debug("getSourceScripts", "availableScripts", availableScripts);
            this.availableScriptsNames = [...new Set(availableScripts.map(script => script.name))];
          })
        }
      },
      async scriptsPage(page, itemsPerPage, properties, directions) {
        this.loading = true;
        await scriptApi.getFilteredScripts(
          page - 1,
          itemsPerPage,
          properties,
          directions,
          new SourceScriptFilter(
            this.selectedScriptId,
            this.selectedScriptName,
            this.selectedScriptTag
          )
        ).then(response => {
          const sourceScriptPage = response.data;
          debug("getScripts", "sourceScriptPage:", sourceScriptPage);

          this.items = sourceScriptPage.items;
          this.totalItems = sourceScriptPage.totalItems;
          this.totalPages = sourceScriptPage.totalPages;
          this.loading = false;
        })
      },
      refreshFirstPage() {
        if (this.options.page === 1) {
          this.refreshCurrentPage();
        } else {
          this.options.page = 1;
        }
      },
      refreshCurrentPage() {
        this.scriptsPage(this.options.page, this.itemsPerPage, this.properties, this.directions);
      },
      addScript() {
        this.refreshCurrentPage();
      },
      deleteScript() {
        this.refreshCurrentPage();
      }
    },
    watch: {
      options(value) {
        const {page, itemsPerPage, sortBy, sortDesc} = value;
        const itemsPerPageNormalized = itemsPerPage === -1 ? this.totalItems : itemsPerPage;
        const directions = sortDesc.map(desc => desc ? Direction.DESCENDING : Direction.ASCENDING);
        this.itemsPerPage = itemsPerPageNormalized;
        this.properties = sortBy;
        this.directions = directions;
        this.scriptsPage(page, itemsPerPageNormalized, sortBy, directions).then(() => {
          if (page > this.totalPages) {
            this.options.page = this.totalPages > 0 ? this.totalPages : 1;
          }
        });
      }
    },
    beforeMount() {
      this.getSourceScripts();
    }
  }
</script>

<style scoped>

</style>