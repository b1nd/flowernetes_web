<template>
  <v-content class="grey lighten-5">
    <v-container fluid>
      <router-view/>
    </v-container>
    <v-snackbar
      v-model="showSnackbar"
      :timeout="5000"
    >
      {{ snackbarMessage }}
      <v-btn
        color="secondary"
        text
        @click="hideSnackbar"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-content>
</template>

<script>
  import snackbarMessage from "../utils/snackbarMessage";

  export default {
    name: "AppContent",
    computed: {
      showSnackbar: {
        get() {
          return this.$store.getters.showSnackbar;
        },
        set(value) {
          if (!value) this.hideSnackbar();
        }
      },
      snackbarMessage() {
        return this.$store.getters.snackbarMessage;
      }
    },
    methods: {
      hideSnackbar() {
        snackbarMessage.hide();
      }
    }
  }
</script>

<style scoped>

</style>