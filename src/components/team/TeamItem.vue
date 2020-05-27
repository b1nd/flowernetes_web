<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-list-item link v-on="on" class="pa-0">
        <v-list-item-content>
          {{title}}
        </v-list-item-content>
      </v-list-item>
    </template>
    <TeamInfo
      @input="v => $emit('input', v)"
      @change="teamDeleted"
      :editable="editable"
      v-if="dialog"
      v-model="editableTeam"
    />
  </v-dialog>
</template>

<script>
  import TeamInfo from "./TeamInfo";

  export default {
    name: "TeamItem",
    components: {TeamInfo},
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      team: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        editableTeam: this.team,
        dialog: false
      }
    },
    computed: {
      title: function () {
        return this.editableTeam.name;
      }
    },
    methods: {
      teamDeleted(team) {
        this.dialog = false;
        this.$emit("change", team)
      }
    }
  }
</script>

<style scoped>

</style>