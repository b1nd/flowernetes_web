<template>
  <v-row class="text-center">
    <v-col cols="12" sm="12">
      <h2>System for Execution Control and Resource Management of Python Scripts</h2>
    </v-col>
    <v-col cols="12" sm="12">
      <h3>Python Scripts Workflows on Kubernetes</h3>
    </v-col>
    <v-col cols="12" sm="12">
      <h3>Sources</h3>
      <a
        v-for="(source, i) in sources"
        :key="i"
        :href="source.link"
      >
        <h3>{{source.label}}</h3>
      </a>
    </v-col>
    <v-col cols="12" sm="12">
      <a :href="swaggerUrl">
        <h3>API Documentation</h3>
      </a>
    </v-col>
  </v-row>
</template>

<script>
  import {swaggerUrl} from "../data/constants/env_constants";

  export default {
    name: "Home",
    data() {
      return {
        sources: [
          {
            label: "backend",
            link: "https://github.com/b1nd/flowernetes"
          },
          {
            label: "web",
            link: "https://github.com/b1nd/flowernetes_web"
          }
        ]
      }
    },
    computed: {
      swaggerUrl() {
        return swaggerUrl;
      }
    }
  }
</script>

<style scoped>
</style>
