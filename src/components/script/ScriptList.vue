<template>
  <v-card
    tile
  >
    <v-card-title>
      Scripts
      <v-spacer/>
      <AddScriptButton
        @change="addScript"
        v-if="isAddScriptAvailable"
      />
    </v-card-title>
    <v-card-text>
      <v-col cols="12" sm="12">
        <v-list>
          <v-divider/>
          <ScriptItem
            v-for="item in items"
            :key="item.id"
            :script="item"
            :editable="true"
            @change="deleteScript"
          />
        </v-list>
        <v-card-text>
          Scripts count: {{totalItems}}
        </v-card-text>

        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @input="scriptsPage"
        />
      </v-col>
    </v-card-text>
  </v-card>
</template>

<script>
  import AddScriptButton from "./AddScriptButton";
  import scriptApi from "../../api/scriptApi"
  import ScriptItem from "./ScriptItem";
  import {debug} from "../../utils/logging";
  import {Order} from "../../data/dto/pagination_dto";
  import {SourceScriptDtoFields} from "../../data/dto/script_dto";

  export default {
    name: "ScriptList",
    components: {ScriptItem, AddScriptButton},
    props: {
      itemsPerPage: {
        type: Number,
        default: 15
      },
      itemsOrder: {
        type: String,
        default: Order.DESCENDING
      },
      fieldsOrderBy: {
        type: Array,
        default: function () {
          return [
            SourceScriptDtoFields.uploadDate
          ]
        }
      }
    },
    data() {
      return {
        currentPage: 0,
        totalPages: 0,
        items: [],
        totalItems: 0
      }
    },
    computed: {
      isAddScriptAvailable() {
        return this.$store.getters.isTeam;
      }
    },
    methods: {
      scriptsPage(page) {
        this.allScriptsPage(page);
      },
      allScriptsPage(page) {
        scriptApi.getScripts(
          page - 1,
          this.itemsPerPage,
          this.itemsOrder,
          this.fieldsOrderBy
        ).then(response => {
          const sourceScriptPage = response.data;
          debug("getScripts", "sourceScriptPage:", sourceScriptPage);

          this.items = sourceScriptPage.items;
          this.totalItems = sourceScriptPage.totalItems;
          this.currentPage = sourceScriptPage.currentPage + 1;
          this.totalPages = sourceScriptPage.totalPages;
        })
      },
      refreshFirstPage: function () {
        this.scriptsPage(1);
      },
      refreshCurrentPage: function () {
        this.scriptsPage(this.currentPage);
      },
      addScript() {
        this.refreshCurrentPage();
      },
      deleteScript() {
        this.refreshCurrentPage();
      }
    },
    beforeMount() {
      this.refreshFirstPage();
    }
  }
</script>

<style scoped>

</style>