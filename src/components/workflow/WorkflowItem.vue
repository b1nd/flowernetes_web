<template>
  <div>
    <v-list-item :value="workflow">
      <v-list-item-title v-text="title"/>
    </v-list-item>
    <v-divider/>
  </div>
</template>

<script>
  export default {
    name: "WorkflowItem",
    props: {
      workflow: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        editableWorkflow: this.workflow
      }
    },
    computed: {
      title() {
        return this.editableWorkflow.name;
      }
    }
  }
</script>

<style scoped>

</style>