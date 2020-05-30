<template>
  <v-list-item :value="workflow" class="pa-0">
    <v-list-item-title>
      {{title}}
    </v-list-item-title>
  </v-list-item>
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