<template>
  <div>
    <v-list-item :value="workflow">
      <v-list-item-title>
        <v-row no-gutters>
          <v-col cols="12" sm="9">
            {{title}}
          </v-col>
          <v-col cols="12" sm="3" class="text-right">
            <v-icon v-if="editableWorkflow.isPublic">mdi-lock-open</v-icon>
            <v-icon v-else>mdi-lock</v-icon>
          </v-col>
        </v-row>
      </v-list-item-title>
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