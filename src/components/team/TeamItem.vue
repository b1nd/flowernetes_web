<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <div>
        <v-list-item link v-on="on">
          <v-list-item-content>
            <v-list-item-title
              v-text="title"
            />
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
      </div>
    </template>
    <TeamInfo
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