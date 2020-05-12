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
          <div id="cpuUsagePlot"/>
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

  export default {
    name: "CpuUsageMonitoring",
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
        cpuUsages: []
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
        this.getWorkflowCpuUsage()
          .then(() => this.renderCpuUsagePlot())
      },
      requestUsageToString(usage) {
        return `${usage.task.name}: ${usage.request} cores`;
      },
      limitUsageToString(usage) {
        return `${usage.task.name}: ${usage.limit} cores`;
      },
      renderCpuUsagePlot() {
        const data = [
          {
            x: this.cpuUsages.map(cpuUsage => cpuUsage.time),
            y: this.cpuUsages.map(cpuUsage => cpuUsage.totalRequest),
            text: this.cpuUsages.map(cpuUsage => cpuUsage.usages.map(this.requestUsageToString).join("<br>")),
            mode: 'lines+markers',
            name: 'requests',
            line: {shape: 'hv'},
            type: 'scatter'
          },
          {
            x: this.cpuUsages.map(cpuUsage => cpuUsage.time),
            y: this.cpuUsages.map(cpuUsage => cpuUsage.totalLimit),
            text: this.cpuUsages.map(cpuUsage => cpuUsage.usages.map(this.limitUsageToString).join("<br>")),
            mode: 'lines+markers',
            name: 'limits',
            line: {shape: 'hv'},
            type: 'scatter'
          },
        ];

        const layout = {
          title: `CPU usage for workflow ${this.workflow.name}`,
          yaxis: {
            title: "cores"
          },
          showlegend: true
        };
        const config = {responsive: true};

        Plotly.newPlot('cpuUsagePlot', data, layout, config);
      },
      async getWorkflowCpuUsage() {
        await workflowApi.getWorkflowCpuUsage(
          this.workflow.id,
          this.startDate,
          this.endDate
        ).then(response => {
          const tasksCpuUsagesDto = response.data;
          debug("getWorkflowCpuUsage", "tasksCpuUsagesDto", tasksCpuUsagesDto);
          this.cpuUsages = tasksCpuUsagesDto.items;
          this.isDataLoaded = true;
        })
      },
      getCurrentDate() {
        return new Date().toISOString().substr(0, 10);
      }
    },
    mounted() {
      this.plot();
    }
  }
</script>

<style scoped>

</style>