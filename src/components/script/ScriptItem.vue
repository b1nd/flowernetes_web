<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-list-item link v-on="on">
        <v-list-item-content>
          {{editableScript.name}}
        </v-list-item-content>
      </v-list-item>
    </template>
    <ScriptInfo
      v-model="editableScript"
      :editable="editable"
      @change="onScriptDeleted"
    />
  </v-dialog>
</template>

<script>
  import ScriptInfo from "./ScriptInfo";

  export default {
    name: "ScriptItem",
    components: {ScriptInfo},
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      script: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        dialog: false,
        editableScript: this.script
      }
    },
    methods: {
      onScriptDeleted(script) {
        this.dialog = false;
        this.$emit("change", script)
      }
    }
  }
</script>

<style scoped>

</style>