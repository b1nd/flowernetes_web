<template>
  <v-list>
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
      dense
    >
      <InfoItem :item="item"/>
    </v-list-item>
  </v-list>
</template>

<script>
  import InfoItem from "./InfoItem";

  export default {
    name: "ListInfoItems",
    components: {InfoItem},
    props: {
      items: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>