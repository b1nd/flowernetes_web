<template>
  <v-card>
    <v-card-title>
      <v-btn
        v-for="border in legendBorder"
        :key="border.name"
        class="mx-1"
        x-small
        outlined
        :color="border.color"
      >
        {{border.name}}
      </v-btn>
      <v-spacer/>
      <v-btn
        v-for="status in legendStatuses"
        :key="status.name"
        class="mx-1"
        x-small
        elevation="0"
        :color="status.color"
      >
        {{status.name}}
      </v-btn>
    </v-card-title>
    <div class="graph">
      <svg>
        <g/>
      </svg>
    </div>
  </v-card>
</template>

<script>
  import * as dagreD3 from "dagre-d3";
  import * as d3 from "d3";
  import moment from "moment";
  import {debug} from "../../utils/logging";
  import workflowApi from "../../api/workflowApi";
  import {newStompClient} from "../../api/stomp";
  import {TopicPath} from "../../data/dto/workflow_dto";
  import snackbarMessage from "../../utils/snackbarMessage";

  export default {
    name: "WorkflowGraphMonitoring",
    props: {
      workflow: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        legendBorder: [
          {name: "outer dependency", color: "#01579B"},
          {name: "inner dependency", color: "black"}
        ],
        legendStatuses: [
          {name: "waiting", color: "#80D8FF"},
          {name: "pending", color: "#A1887F"},
          {name: "running", color: "#FBC02D"},
          {name: "success", color: "#69F0AE"},
          {name: "error", color: "#EF5350"},
          {name: "quota exceeded", color: "#F48FB1"},
          {name: "time exceeded", color: "#FF8A65"},
          {name: "killed", color: "#D1C4E9"},
          {name: "inactive", color: "#E0E0E0"}
        ],
        render: new dagreD3.render(),
        stomp: null,
        workflowGraph: null,
        tasksStatusInfo: {},
        graph: null,
        svg: null,
        svgGroup: null,
        zoom: null
      }
    },
    methods: {
      setupGraph() {
        if (!this.workflowGraph.nodes.length) {
          snackbarMessage.show("Graph is empty!");
          return;
        }

        this.graph = new dagreD3.graphlib.Graph()
          .setGraph({
            nodesep: 70,
            ranksep: 50,
            rankdir: "LR",
            marginx: 20,
            marginy: 20
          })
          .setDefaultEdgeLabel(function () {
            return {};
          });

        this.workflowGraph.nodes.forEach(this.setGraphNode);

        this.workflowGraph.edges.forEach(this.setGraphEdge);

        this.svg = d3.select("svg");
        this.svgGroup = this.svg.select("g");

        this.zoom = d3.zoom().on("zoom", () => {
          this.svgGroup.attr("transform", d3.event.transform);
        });
        this.svg.call(this.zoom);

        this.render(this.svgGroup, this.graph);
        this.zoomGraph();
      },
      zoomGraph() {
        const graphWidth = this.graph.graph().width + 80;
        const graphHeight = this.graph.graph().height + 40;
        const width = parseInt(this.svg.style("width").replace(/px/, ""));
        const height = parseInt(this.svg.style("height").replace(/px/, ""));
        const zoomScale = Math.min(width / graphWidth, height / graphHeight);
        const translateX = (width / 2) - ((graphWidth * zoomScale) / 2);
        const translateY = (height / 2) - ((graphHeight * zoomScale) / 2);
        const transform = d3.zoomIdentity.translate(translateX, translateY).scale(zoomScale);
        this.svg.call(this.zoom.transform, transform);
      },
      setGraphNode(node) {
        const task = node.value;
        const type = node.type;
        const status = this.tasksStatusInfo[task.id];
        this.graph.setNode(task.id, {
          label: `${task.name}\n \n${this.formatDate(status.lastTransitionTime)}`,
          rx: 5,
          ry: 5,
          class: `${this.getNodeClassByType(type)} ${this.getNodeClassByStatus(status)}`
        });
      },
      formatDate(time) {
        return moment(time).format("MM.DD HH:mm:ss");
      },
      getNodeClassByType(nodeType) {
        return nodeType.toLowerCase()
      },
      getNodeClassByStatus(status) {
        return status.taskStatus.toLowerCase()
      },
      getEdgeClassByType(edgeType) {
        return edgeType.toLowerCase()
      },
      setGraphEdge(edge) {
        this.graph.setEdge(edge.from, edge.to, {
          arrowhead: "normal",
          class: this.getEdgeClassByType(edge.type)
        });
      },
      async getWorkflowGraph() {
        await workflowApi.getWorkflowGraph(this.workflow.id).then(response => {
          const workflowGraph = response.data;
          debug("getWorkflowGraph", "workflowGraph", workflowGraph);
          this.workflowGraph = workflowGraph;
          this.workflowGraph.statuses.forEach(this.onNewTaskStatusInfo)
        });
      },
      // fixme: it may skip updates between graph init and topic subscribe
      async subscribeOnDependentUpdates() {
        const dependencyWorkflows = [...new Set(this.workflowGraph.nodes
          .map(n => n.value.workflow.id)
          .filter(id => id !== this.workflow.id))
        ];
        const outerTasks = {};
        this.workflowGraph.nodes
          .map(n => n.value)
          .filter(task => task.workflow.id !== this.workflow.id)
          .forEach(task => outerTasks[task.id] = true);

        dependencyWorkflows.forEach(workflowId => {
          const topic = `${TopicPath.WORKFLOW}/${workflowId}`;
          debug("Subscribed on topic", topic);
          this.stomp.subscribe(topic, frame => {
            const taskStatusInfo = JSON.parse(frame.body);
            debug("New taskStatusInfo:", taskStatusInfo);
            if (outerTasks[taskStatusInfo.taskId]) {
              this.onNewTaskStatusInfo(taskStatusInfo);
              this.updateGraph(taskStatusInfo);
            }
          });
        })
      },
      async subscribeOnUpdates() {
        this.stomp = newStompClient();
        this.stomp.connect({}, () => {
          debug("Stomp connected");
          const topic = `${TopicPath.WORKFLOW}/${this.workflow.id}`;
          debug("Subscribed on topic", topic);
          this.stomp.subscribe(topic, frame => {
            const taskStatusInfo = JSON.parse(frame.body);
            debug("New taskStatusInfo:", taskStatusInfo);
            this.onNewTaskStatusInfo(taskStatusInfo);
            this.updateGraph(taskStatusInfo);
          });
        });
      },
      onNewTaskStatusInfo(newStatus) {
        const oldStatus = this.tasksStatusInfo[newStatus.taskId];
        if (oldStatus) {
          if (newStatus.lastTransitionTime >= oldStatus.lastTransitionTime) {
            this.tasksStatusInfo[newStatus.taskId] = newStatus;
          }
        } else {
          this.tasksStatusInfo[newStatus.taskId] = newStatus;
        }
      },
      updateGraph(newStatus) {
        const changedNode = this.workflowGraph.nodes.find(n => n.value.id === newStatus.taskId);
        if (changedNode) {
          this.setGraphNode(changedNode);
          this.render(this.svgGroup, this.graph);
        }
      },
      generateGraph() {
        this.subscribeOnUpdates()
          .then(() => this.getWorkflowGraph())
          .then(() => this.subscribeOnDependentUpdates())
          .then(() => this.setupGraph());
      },
      closeConnection() {
        this.stomp.disconnect();
      }
    },
    mounted() {
      this.generateGraph();
    },
    destroyed() {
      this.closeConnection();
    }
  }
</script>

<style>
  .graph {
    width: 100%;
    height: 100%;
  }

  .graph .node rect {
    color: black;
    stroke: #333333;
    stroke-width: 2px;
  }

  .graph .node text {
    font-size: 15px;
    font-weight: 300;
    fill: black;
  }

  .graph .success {
    fill: #69F0AE;
  }

  .graph .error {
    fill: #EF5350;
  }

  .graph .quota_exceeded {
    fill: #F48FB1;
  }

  .graph .time_exceeded {
    fill: #FF8A65;
  }

  .graph .waiting {
    fill: #80D8FF;
  }

  .graph .running {
    fill: #FBC02D;
  }

  .graph .killed {
    fill: #D1C4E9;
  }

  .graph .inactive {
    fill: #E0E0E0;
  }

  .graph .pending {
    fill: #A1887F;
  }

  .graph .inner rect {
    stroke: #333333;
  }

  .graph .outer rect {
    stroke: #01579B;
  }

  .graph .edgePath {
    stroke-width: 2px;
    stroke: #333333;
    fill: #333333;
  }

  .graph .strict {
  }

  .graph .weak {
    stroke-dasharray: 8, 4;
  }

  .graph svg {
    width: 100%;
    height: 100%;
  }
</style>