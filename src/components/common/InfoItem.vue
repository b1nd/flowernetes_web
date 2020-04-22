<template>
  <v-row>
    <v-col cols="0" sm="0">
      <v-icon>{{ item.icon }}</v-icon>
    </v-col>

    <v-col cols="12" :sm="cols">
      {{ item.key }}
    </v-col>
    <v-divider vertical/>

    <v-col cols="12" :sm="12 - cols - 1">
      <span :class="itemTextColor">{{item.value}}</span>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: "InfoItem",
    props: {
      cols: {
        type: Number,
        default: 2
      },
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      itemTextColor() {
        return this.item.color + "--text";
      }
    }
  }
</script>

<style scoped>

</style>