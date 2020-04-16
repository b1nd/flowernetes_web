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
  </v-app-bar>
</template>

<script>
  export default {
    name: "AppBar",
    data: () => ({
      toolbarItems: [
        {title: 'Workflows', link: '/workflows'}
      ]
    })
  }
</script>

<style scoped>
  #title {
    margin-top: 10px;
    margin-right: 15px;
  }
</style>
