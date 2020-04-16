<template>
  <v-card
    tile
  >
    <v-card-title>
      {{workflow.name}} tasks
    </v-card-title>
  </v-card>
</template>

<script>
  export default {
    name: "TaskList",
    props: {
      workflow: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>