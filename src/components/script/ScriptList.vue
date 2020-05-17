<template>
  <v-card tile>
    <v-card-title>
      Scripts
      <v-spacer/>
      <AddScriptButton
        @change="addScript"
        v-if="isAddScriptAvailable"
      />
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
  import {SourceScriptDtoFields} from "../../data/dto/script_dto";
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
        default: function () {
          return [
            SourceScriptDtoFields.uploadDate
          ]
        }
      },
      baseDirections: {
        type: Array,
        default: function () {
          return [
            Direction.DESCENDING
          ]
        }
      }
    },
    data() {
      return {
        currentPage: 0,
        itemsPerPage: this.baseItemsPerPage,
        properties: this.baseProperties,
        directions: this.baseDirections,
        items: [],
        totalItems: 0,
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
      }
    },
    methods: {
      formatDate(date) {
        return fullDate(date);
      },
      scriptsPage(page, itemsPerPage, properties, directions) {
        this.allScriptsPage(page, itemsPerPage, properties, directions);
      },
      async allScriptsPage(page, itemsPerPage, properties, directions) {
        this.loading = true;
        await scriptApi.getScripts(
          page - 1,
          itemsPerPage,
          properties,
          directions
        ).then(response => {
          const sourceScriptPage = response.data;
          debug("getScripts", "sourceScriptPage:", sourceScriptPage);

          this.items = sourceScriptPage.items;
          this.totalItems = sourceScriptPage.totalItems;
          this.currentPage = sourceScriptPage.currentPage + 1;
          this.loading = false;
        })
      },
      refreshCurrentPage() {
        this.scriptsPage(this.currentPage, this.itemsPerPage, this.properties, this.directions);
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
        this.scriptsPage(page, itemsPerPageNormalized, sortBy, directions);
      }
    }
  }
</script>

<style scoped>

</style>