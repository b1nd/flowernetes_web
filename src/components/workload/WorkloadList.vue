<template>
  <v-card tile>
    <v-card-title>
      Workloads
    </v-card-title>
    <v-card-text>
      <v-col cols="12" sm="12">
        <v-list>
          <v-divider/>
          <WorkloadItem
            v-for="item in items"
            :key="item.id"
            :workload="item"
            :editable="true"
          />
        </v-list>
        <v-card-text>
          Workloads count: {{totalItems}}
        </v-card-text>

        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @input="workloadsPage"
        />
      </v-col>
    </v-card-text>
  </v-card>
</template>

<script>
  import {Order} from "../../data/dto/pagination_dto";
  import {debug} from "../../utils/logging";
  import {WorkloadFields} from "../../data/dto/workload_dto";
  import workloadApi from "../../api/workloadApi";
  import WorkloadItem from "./WorkloadItem";

  export default {
    name: "WorkloadList",
    components: {WorkloadItem},
    props: {
      itemsPerPage: {
        type: Number,
        default: 8
      },
      itemsOrder: {
        type: String,
        default: Order.DESCENDING
      },
      fieldsOrderBy: {
        type: Array,
        default: function () {
          return [
            WorkloadFields.workloadCreationTime
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
    methods: {
      workloadsPage(page) {
        this.allWorkloadsPage(page);
      },
      allWorkloadsPage(page) {
        workloadApi.getWorkloads(
          page - 1,
          this.itemsPerPage,
          this.itemsOrder,
          this.fieldsOrderBy
        ).then(response => {
          const workloadsPage = response.data;
          debug("getWorkloads", "workloadsPage:", workloadsPage);

          this.items = workloadsPage.items;
          this.totalItems = workloadsPage.totalItems;
          this.currentPage = workloadsPage.currentPage + 1;
          this.totalPages = workloadsPage.totalPages;
        });
      },
      refreshFirstPage: function () {
        this.workloadsPage(1);
      },
      refreshCurrentPage: function () {
        this.workloadsPage(this.currentPage);
      }
    },
    beforeMount() {
      this.refreshFirstPage();
    }
  }
</script>

<style scoped>

</style>