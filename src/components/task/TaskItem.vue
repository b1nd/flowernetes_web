<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-list-item link v-on="on" class="pa-0">
        <v-list-item-content>
          {{editableTask.name}}
        </v-list-item-content>
      </v-list-item>
    </template>
    <TaskInfo
      @change="onTaskDeleted"
      editable
      v-model="editableTask"
    />
  </v-dialog>
</template>

<script>
  import TaskInfo from "./TaskInfo";

  export default {
    name: "TaskItem",
    components: {TaskInfo},
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      task: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        dialog: false,
        editableTask: this.task
      }
    },
    methods: {
      onTaskDeleted(task) {
        this.dialog = false;
        this.$emit("change", task)
      }
    }
  }
</script>

<style scoped>

</style>