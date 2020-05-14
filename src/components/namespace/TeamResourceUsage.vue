<template>
  <v-row no-gutters>
    <v-col cols="12" sm="12">
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
    </v-col>
    <v-col cols="12" sm="12">
      <v-row no-gutters v-if="isDataLoaded">
        <v-col cols="12" sm="12">
          <div id="cpuUsagePlot"/>
        </v-col>
        <v-col cols="12" sm="12">
          <div id="ramUsagePlot"/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  import Plotly from "plotly.js-dist";
  import moment from "moment";
  import {debug} from "../../utils/logging";
  import {ISO_DATE_FORMAT, localDate} from "../../utils/date";
  import MenuDatePicker from "../common/MenuDatePicker";
  import teamApi from "../../api/teamApi";

  export default {
    name: "TeamResourceUsage",
    components: {MenuDatePicker},
    props: {
      team: {
        type: Object,
        required: true
      },
      requestsColor: {
        type: String,
        default: "#32ab60"
      },
      limitsColor: {
        type: String,
        default: "#EF5350"
      }
    },
    data() {
      return {
        startDate: this.getCurrentDate(),
        endDate: this.getCurrentDate(),
        isDataLoaded: false,
        teamNamespace: null,
        cpuUsages: [],
        ramUsages: []
      }
    },
    computed: {
      isRequiredDataSet() {
        return this.startDate && this.endDate;
      },
      allowedDates() {
        return date => date <= this.getCurrentDate();
      },
      endDateInclusive() {
        return moment(this.endDate).add(1, "d").format(ISO_DATE_FORMAT);
      }
    },
    methods: {
      async plot() {
        await this.getTeamNamespace();
        this.teamCpuUsage().then(() => this.renderCpuUsagePlot());
        this.teamRamUsage().then(() => this.renderRamUsagePlot());
      },
      usageTasks(usage) {
        return `(${usage.tasks.map(t => t.name).join(", ")})`;
      },
      requestCpuUsageToString(usage) {
        return `${usage.workflow.name}: ${usage.request} cores ${this.usageTasks(usage)}`;
      },
      limitCpuUsageToString(usage) {
        return `${usage.workflow.name}: ${usage.limit} cores ${this.usageTasks(usage)}`;
      },
      requestRamUsageToString(usage) {
        return `${usage.workflow.name}: ${usage.request} bytes ${this.usageTasks(usage)}`;
      },
      limitRamUsageToString(usage) {
        return `${usage.workflow.name}: ${usage.limit} bytes ${this.usageTasks(usage)}`;
      },
      renderCpuUsagePlot() {
        const data = [
          {
            x: this.cpuUsages.map(cpuUsage => cpuUsage.time),
            y: this.cpuUsages.map(cpuUsage => cpuUsage.totalRequest),
            text: this.cpuUsages.map(cpuUsage => cpuUsage.usages.map(this.requestCpuUsageToString).join("<br>")),
            mode: "lines+markers",
            name: "requests",
            line: {
              shape: "hv",
              dash: "dashdot",
              width: 1
            },
            type: "scatter"
          },
          {
            x: this.cpuUsages.map(cpuUsage => cpuUsage.time),
            y: this.cpuUsages.map(cpuUsage => cpuUsage.totalLimit),
            text: this.cpuUsages.map(cpuUsage => cpuUsage.usages.map(this.limitCpuUsageToString).join("<br>")),
            mode: "lines+markers",
            name: "limits",
            line: {
              shape: "hv"
            },
            type: "scatter"
          },
          {
            x: [this.startDate, this.endDateInclusive],
            y: [this.teamNamespace.resourceQuota.cpuRequest, this.teamNamespace.resourceQuota.cpuRequest],
            text: ["cpu max requests", "cpu max requests"],
            mode: "lines",
            name: "max requests",
            line: {
              color: this.requestsColor,
              dash: "dashdot"
            }
          },
          {
            x: [this.startDate, this.endDateInclusive],
            y: [this.teamNamespace.resourceQuota.cpuLimit, this.teamNamespace.resourceQuota.cpuLimit],
            text: ["cpu max limits", "cpu max limits"],
            mode: "lines",
            name: "max limits",
            line: {
              color: this.limitsColor
            }
          }
        ];

        const layout = {
          title: `CPU usage for team ${this.team.name}`,
          yaxis: {
            title: "cores"
          },
          showlegend: true
        };
        const config = {responsive: true};

        Plotly.newPlot("cpuUsagePlot", data, layout, config);
      },
      renderRamUsagePlot() {
        const data = [
          {
            x: this.ramUsages.map(ramUsage => ramUsage.time),
            y: this.ramUsages.map(ramUsage => ramUsage.totalRequest),
            text: this.ramUsages.map(ramUsage => ramUsage.usages.map(this.requestRamUsageToString).join("<br>")),
            mode: "lines+markers",
            name: "requests",
            line: {
              shape: "hv",
              dash: "dashdot",
              width: 1
            },
            type: "scatter"
          },
          {
            x: this.ramUsages.map(ramUsage => ramUsage.time),
            y: this.ramUsages.map(ramUsage => ramUsage.totalLimit),
            text: this.ramUsages.map(ramUsage => ramUsage.usages.map(this.limitRamUsageToString).join("<br>")),
            mode: "lines+markers",
            name: "limits",
            line: {
              shape: "hv"
            },
            type: "scatter"
          },
          {
            x: [this.startDate, this.endDateInclusive],
            y: [this.teamNamespace.resourceQuota.memoryRequest, this.teamNamespace.resourceQuota.memoryRequest],
            text: ["memory max requests", "memory max requests"],
            mode: "lines",
            name: "max requests",
            line: {
              color: this.requestsColor,
              dash: "dashdot"
            }
          },
          {
            x: [this.startDate, this.endDateInclusive],
            y: [this.teamNamespace.resourceQuota.memoryLimit, this.teamNamespace.resourceQuota.memoryLimit],
            text: ["memory max limits", "memory max limits"],
            mode: "lines",
            name: "max limits",
            line: {
              color: this.limitsColor
            }
          }
        ];

        const layout = {
          title: `RAM usage for team ${this.team.name}`,
          yaxis: {
            title: "bytes"
          },
          showlegend: true
        };
        const config = {responsive: true};

        Plotly.newPlot("ramUsagePlot", data, layout, config);
      },
      async getTeamNamespace() {
        await teamApi.teamNamespace(this.team.id).then(response => {
          const namespace = response.data;
          debug("teamNamespace", "namespace", namespace);
          this.teamNamespace = namespace;
        })
      },
      async teamCpuUsage() {
        await teamApi.teamCpuUsage(
          this.team.id,
          this.startDate,
          this.endDate
        ).then(response => {
          const teamCpuUsageDto = response.data;
          debug("teamCpuUsage", "teamCpuUsageDto", teamCpuUsageDto);
          this.cpuUsages = teamCpuUsageDto.items;
          this.isDataLoaded = true;
        })
      },
      async teamRamUsage() {
        await teamApi.teamRamUsage(
          this.team.id,
          this.startDate,
          this.endDate
        ).then(response => {
          const teamRamUsageDto = response.data;
          debug("teamRamUsage", "teamRamUsageDto", teamRamUsageDto);
          this.ramUsages = teamRamUsageDto.items;
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