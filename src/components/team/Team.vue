<template>
  <v-row no-gutters justify="center">
    <v-col cols="12" sm="4">
      <TeamList/>
    </v-col>
  </v-row>
</template>

<script>
  import TeamList from "./TeamList";

  export default {
    name: "Team",
    components: {TeamList}
  }
</script>

<style scoped>

</style>