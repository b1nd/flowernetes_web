<template>
  <v-row justify="center" no-gutters>
    <v-col cols="12" sm="6">
      <ScriptList/>
    </v-col>
  </v-row>
</template>

<script>
  import ScriptList from "./ScriptList";

  export default {
    name: "Script",
    components: {ScriptList}
  }
</script>

<style scoped>

</style>