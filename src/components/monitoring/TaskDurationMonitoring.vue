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
          <div id="durationPlot"/>
        </v-col>

        <v-col cols="12" sm="12">
          <div id="averagePlot"/>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Plotly from 'plotly.js-dist'
  import workflowApi from "../../api/workflowApi";
  import {debug} from "../../utils/logging";
  import MenuDatePicker from "../common/MenuDatePicker";
  import {localDate} from "../../utils/date";

  export default {
    name: "TaskDurationMonitoring",
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
        tasksDuration: []
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
        this.getWorkflowTasksDuration()
          .then(() => Promise.all([
            this.renderDurationPlot(),
            this.renderAveragePlot()
          ]))
      },
      renderAveragePlot() {
        const data = [{
          x: this.tasksDuration.map(d => d.task.name),
          y: this.tasksDuration.map(d => d.averageTime),
          type: 'bar'
        }];

        const layout = {
          title: `Task average duration for workflow ${this.workflow.name}`,
          yaxis: {
            title: "Seconds"
          }
        };
        const config = {responsive: true};

        Plotly.newPlot('averagePlot', data, layout, config);
      },
      renderDurationPlot() {
        const data = this.tasksDuration.map(taskDuration => {
          return {
            name: taskDuration.task.name,
            x: taskDuration.durations.map(d => d.dateTime),
            y: taskDuration.durations.map(d => d.seconds),
            mode: 'lines+markers',
            connectgaps: true
          }
        });

        const layout = {
          title: `Task duration for workflow ${this.workflow.name}`,
          yaxis: {
            title: "Seconds"
          },
          showlegend: true
        };
        const config = {responsive: true};

        Plotly.newPlot('durationPlot', data, layout, config);
      },
      async getWorkflowTasksDuration() {
        await workflowApi.getWorkflowTasksDuration(
          this.workflow.id,
          this.startDate,
          this.endDate
        ).then(response => {
          const tasksDurationDto = response.data;
          debug("getWorkflowTasksDuration", "tasksDurationDto", tasksDurationDto);
          this.tasksDuration = tasksDurationDto.items;
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