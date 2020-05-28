<template>
  <v-app-bar
    app
    clipped-left
    color="primary">
    <v-toolbar-title id="title">
      <router-link
        to="/"
        tag="span"
        style="cursor: pointer"
      >
        <img src="../assets/logo.svg" style="width: 60px" alt="flowernetes"/>
      </router-link>
    </v-toolbar-title>
    <v-toolbar-items>
      <v-btn
        text
        color="secondary"
        v-for="item in toolbarItems"
        :key="item.title"
        :to="item.link">
        {{ item.title }}
      </v-btn>
    </v-toolbar-items>
    <v-spacer/>
    <span class="secondary--text">{{time}}</span>
  </v-app-bar>
</template>

<script>
  import moment from "moment";

  export default {
    name: "AppBar",
    data: () => ({
      time: "",
      toolbarItems: [
        {title: 'Workflows', link: '/workflows'},
        {title: 'Workloads', link: '/workloads'},
        {title: 'Scripts', link: '/scripts'},
        {title: 'Monitoring', link: '/monitoring'}
      ]
    }),
    methods: {
      updateTime() {
        this.time = moment().local(true).format("dddd, MMMM Do YYYY, h:mm:ss");
      }
    },
    beforeMount() {
      this.updateTime();
      setInterval(this.updateTime, 1000);
    }
  }
</script>

<style scoped>
  #title {
    margin-top: 10px;
    margin-right: 15px;
  }
</style>
