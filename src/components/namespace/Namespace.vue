<template>
  <v-card>
    <v-card-text v-if="sessionTeam">
      <TeamResourceUsage
        :team="sessionTeam"
      />
    </v-card-text>
  </v-card>
</template>

<script>
  import TeamResourceUsage from "./TeamResourceUsage";

  export default {
    name: "Namespace",
    components: {TeamResourceUsage},
    computed: {
      sessionTeam() {
        return this.$store.getters.sessionTeam;
      }
    }
  }
</script>

<style scoped>

</style>