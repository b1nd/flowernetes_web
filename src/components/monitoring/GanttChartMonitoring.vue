<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="2">
          <MenuDatePicker
            :allowed-dates="allowedDates"
            label="Date"
            v-model="date"
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
          <div id="ganttChart"/>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Plotly from "plotly.js-dist";
  import workflowApi from "../../api/workflowApi";
  import {debug} from "../../utils/logging";
  import MenuDatePicker from "../common/MenuDatePicker";

  export default {
    name: "GanttChartMonitoring",
    components: {MenuDatePicker},
    props: {
      workflow: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        date: this.getCurrentDate(),
        isDataLoaded: false,
        intervals: []
      }
    },
    computed: {
      isRequiredDataSet() {
        return this.date;
      },
      allowedDates() {
        return date => date <= this.getCurrentDate();
      }
    },
    methods: {
      plot() {
        this.getWorkflowGanttChart()
          .then(() => this.renderGanttPlot())
      },
      renderGanttPlot() {
        const data = this.intervals.map(taskInterval => {
          return {
            name: taskInterval.task.name,
            x: [taskInterval.interval.from, taskInterval.interval.to],
            y: [taskInterval.task.name, taskInterval.task.name],
            mode: "lines",
            text: [taskInterval.interval.seconds, taskInterval.interval.seconds],
            line: {width: 24}
          }
        });

        const layout = {
          title: `Gantt chart for workflow ${this.workflow.name}`,
          showlegend: false,
          yaxis: {
            autorange: "reversed"
          },
          margin: {
            l: 230,
            pad: 5
          }
        };
        const config = {responsive: true};

        Plotly.newPlot('ganttChart', data, layout, config);
      },
      async getWorkflowGanttChart() {
        await workflowApi.getWorkflowGanttChart(
          this.workflow.id,
          this.date
        ).then(response => {
          const ganttChart = response.data;
          debug("getWorkflowGanttChart", "ganttChart", ganttChart);
          this.intervals = ganttChart.intervals;
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