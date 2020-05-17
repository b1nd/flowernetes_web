<template>
  <v-card tile>
    <v-card-title>
      Workloads
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
        <template v-slot:item.task.name="{ item }">
          <WorkloadItem :workload="item"/>
        </template>

        <template v-slot:item.taskStartTime="{ item }">
          <span>{{formatDate(item.taskStartTime)}}</span>
        </template>

        <template v-slot:item.taskCompletionTime="{ item }">
          <span>{{formatDate(item.taskCompletionTime)}}</span>
        </template>

        <template v-slot:item.elapsed="{ item }">
          <span>{{elapsedTime(item)}} seconds</span>
        </template>

        <template v-slot:item.taskStatus="{ item }">
          <v-chip :color="statusColor(item.taskStatus)" dark>{{ item.taskStatus }}</v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import {Direction} from "../../data/dto/pagination_dto";
  import {debug} from "../../utils/logging";
  import {WorkloadFields} from "../../data/dto/workload_dto";
  import workloadApi from "../../api/workloadApi";
  import {TaskStatusColor} from "../../data/constants/task_constants";
  import WorkloadItem from "./WorkloadItem";
  import {differenceSeconds, fullDate} from "../../utils/date";

  export default {
    name: "WorkloadList",
    components: {WorkloadItem},
    props: {
      baseItemsPerPage: {
        type: Number,
        default: 15
      },
      baseProperties: {
        type: Array,
        default: function () {
          return [
            WorkloadFields.workloadCreationTime
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
          {text: "Name", value: "task.name"},
          {text: "Start time", value: "taskStartTime"},
          {text: "Completion Time", value: "taskCompletionTime"},
          {text: "Elapsed Time", value: "elapsed", sortable: false},
          {text: "Status", value: "taskStatus"}
        ]
      }
    },
    methods: {
      elapsedTime(item) {
        return differenceSeconds(item.taskCompletionTime, item.taskStartTime);
      },
      formatDate(date) {
        return fullDate(date);
      },
      workloadsPage(page, itemsPerPage, properties, directions) {
        this.allWorkloadsPage(page, itemsPerPage, properties, directions);
      },
      async allWorkloadsPage(page, itemsPerPage, properties, directions) {
        this.loading = true;
        await workloadApi.getWorkloads(
          page - 1,
          itemsPerPage,
          properties,
          directions
        ).then(response => {
          const workloadsPage = response.data;
          debug("getWorkloads", "workloadsPage:", workloadsPage);

          this.items = workloadsPage.items;
          this.totalItems = workloadsPage.totalItems;
          this.currentPage = workloadsPage.currentPage + 1;
          this.loading = false;
        });
      },
      refreshCurrentPage() {
        this.workloadsPage(this.currentPage, this.itemsPerPage, this.properties, this.directions);
      },
      statusColor(status) {
        return TaskStatusColor[status];
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
        this.workloadsPage(page, itemsPerPageNormalized, sortBy, directions);
      }
    }
  }
</script>

<style scoped>

</style>