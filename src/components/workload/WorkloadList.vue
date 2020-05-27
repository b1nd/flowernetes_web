<template>
  <v-card tile>
    <v-card-title>
      <v-row dense class="align-center">
        <v-col cols="12" sm="1">
          <v-text-field
            v-model="selectedId"
            clearable
            label="Id"
            hide-details
          />
        </v-col>
        <v-col cols="12" xl="4" sm="3">
          <v-autocomplete
            v-model="selectedTaskId"
            clearable
            label="Name"
            :item-text="taskSelectionText"
            item-value="id"
            :items="availableTasks"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2">
          <MenuDatePicker
            label="Start date"
            v-model="startDate"
          />
        </v-col>
        <v-col cols="12" sm="2">
          <MenuDatePicker
            label="End date"
            v-model="endDate"
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-select
            clearable
            hide-details
            label="Status"
            v-model="selectedStatus"
            :items="availableStatuses"
          />
        </v-col>
        <v-col cols="12" xl="1" sm="2" class="text-center">
          <v-btn
            outlined
            @click="refreshPage"
          >
            apply
            <v-icon class="ml-1">mdi-magnify</v-icon>
          </v-btn>
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
  import {WorkloadFields, WorkloadFilter} from "../../data/dto/workload_dto";
  import workloadApi from "../../api/workloadApi";
  import {TaskStatusColor} from "../../data/constants/task_constants";
  import WorkloadItem from "./WorkloadItem";
  import {differenceSeconds, fullDate} from "../../utils/date";
  import MenuDatePicker from "../common/MenuDatePicker";
  import {TaskStatus} from "../../data/dto/task_dto";

  export default {
    name: "WorkloadList",
    components: {MenuDatePicker, WorkloadItem},
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
        itemsPerPage: this.baseItemsPerPage,
        properties: this.baseProperties,
        directions: this.baseDirections,
        items: [],
        selectedId: null,
        selectedTaskId: null,
        startDate: null,
        endDate: null,
        selectedStatus: null,
        totalItems: 0,
        totalPages: 1,
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
    computed: {
      availableTasks() {
        return this.$store.getters.availableTasks;
      },
      availableStatuses() {
        return Object.keys(TaskStatus);
      }
    },
    methods: {
      elapsedTime(item) {
        return differenceSeconds(item.taskCompletionTime, item.taskStartTime);
      },
      formatDate(date) {
        return fullDate(date);
      },
      taskSelectionText(task) {
        return task && task.name ? `${task.workflow.name}/${task.name}` : "";
      },
      async workloadsPage(page, itemsPerPage, properties, directions) {
        this.loading = true;
        await workloadApi.getFilteredWorkloads(
          page - 1,
          itemsPerPage,
          properties,
          directions,
          new WorkloadFilter(
            this.selectedId,
            this.selectedTaskId,
            this.startDate,
            this.endDate,
            this.selectedStatus
          )
        ).then(response => {
          const workloadsPage = response.data;
          debug("getWorkloads", "workloadsPage:", workloadsPage);

          this.items = workloadsPage.items;
          this.totalItems = workloadsPage.totalItems;
          this.totalPages = workloadsPage.totalPages;
          this.loading = false;
        });
      },
      refreshPage() {
        if (this.options.page === 1) {
          this.workloadsPage(this.options.page, this.itemsPerPage, this.properties, this.directions);
        } else {
          this.options.page = 1;
        }
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
        this.workloadsPage(page, itemsPerPageNormalized, sortBy, directions).then(() => {
          if (page > this.totalPages) {
            this.options.page = this.totalPages > 0 ? this.totalPages : 1;
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>