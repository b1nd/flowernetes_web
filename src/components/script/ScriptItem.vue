<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <div>
        <v-list-item link v-on="on">
          <v-list-item-content>
            <v-list-item-title>
              <v-row no-gutters>
                <v-col cols="12" sm="9">
                  <span>{{editableScript.name}}</span>
                </v-col>
                <v-col cols="12" sm="3" class="text-right">
                  <span class="primary--text">{{editableScript.tag}}</span>
                </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
      </div>
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