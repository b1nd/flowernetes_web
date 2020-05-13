<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="2">
          <MenuDatePicker
            :allowed-dates="allowedDates"
            label="Start date"
            v-model="startDate"
          />
        </v-col>
        <v-col cols="12" sm="2">
          <MenuDatePicker
            :allowed-dates="allowedDates"
            label="End date"
            v-model="endDate"
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn
            outlined
            :disabled="!isRequiredDataSet"
            @click="plot"
          >
            plot
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row no-gutters v-if="isDataLoaded">
        <v-col cols="12" sm="12">
          <div id="ramUsagePlot"/>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
  import MenuDatePicker from "../common/MenuDatePicker";
  import Plotly from "plotly.js-dist";
  import workflowApi from "../../api/workflowApi";
  import {debug} from "../../utils/logging";
  import {localDate} from "../../utils/date";

  export default {
    name: "RamUsageMonitoring",
    components: {MenuDatePicker},
    props: {
      workflow: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        startDate: this.getCurrentDate(),
        endDate: this.getCurrentDate(),
        isDataLoaded: false,
        ramUsages: []
      }
    },
    computed: {
      isRequiredDataSet() {
        return this.startDate && this.endDate;
      },
      allowedDates() {
        return date => date <= this.getCurrentDate();
      }
    },
    methods: {
      plot() {
        this.getWorkflowRamUsage()
          .then(() => this.renderRamUsagePlot())
      },
      requestUsageToString(usage) {
        return `${usage.task.name}: ${usage.request} bytes`;
      },
      limitUsageToString(usage) {
        return `${usage.task.name}: ${usage.limit} bytes`;
      },
      renderRamUsagePlot() {
        const data = [
          {
            x: this.ramUsages.map(ramUsage => ramUsage.time),
            y: this.ramUsages.map(ramUsage => ramUsage.totalRequest),
            text: this.ramUsages.map(ramUsage => ramUsage.usages.map(this.requestUsageToString).join("<br>")),
            mode: 'lines+markers',
            name: 'requests',
            line: {shape: 'hv'},
            type: 'scatter'
          },
          {
            x: this.ramUsages.map(ramUsage => ramUsage.time),
            y: this.ramUsages.map(ramUsage => ramUsage.totalLimit),
            text: this.ramUsages.map(ramUsage => ramUsage.usages.map(this.limitUsageToString).join("<br>")),
            mode: 'lines+markers',
            name: 'limits',
            line: {shape: 'hv'},
            type: 'scatter'
          },
        ];

        const layout = {
          title: `RAM usage for workflow ${this.workflow.name}`,
          yaxis: {
            title: "bytes"
          },
          showlegend: true
        };
        const config = {responsive: true};

        Plotly.newPlot('ramUsagePlot', data, layout, config);
      },
      async getWorkflowRamUsage() {
        await workflowApi.getWorkflowRamUsage(
          this.workflow.id,
          this.startDate,
          this.endDate
        ).then(response => {
          const tasksRamUsagesDto = response.data;
          debug("getWorkflowRamUsage", "tasksRamUsagesDto", tasksRamUsagesDto);
          this.ramUsages = tasksRamUsagesDto.items;
          this.isDataLoaded = true;
        })
      },
      getCurrentDate() {
        return localDate();
      }
    },
    mounted() {
      this.plot();
    }
  }
</script>

<style scoped>

</style>