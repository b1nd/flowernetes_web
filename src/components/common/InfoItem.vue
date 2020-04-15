<template>
  <v-row>
    <v-col cols="0" sm="0">
      <v-icon>{{ item.icon }}</v-icon>
    </v-col>

    <v-col cols="12" sm="2">
      {{ item.key }}
    </v-col>
    <v-divider vertical/>

    <v-col cols="12" sm="9">
      {{item.value}}
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: "InfoItem",
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>