<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        hide-details
        clearable
        v-model="valueInput"
        :label="label"
        readonly
        v-on="on"
      />
    </template>
    <v-date-picker
      no-title
      :allowed-dates="allowedDates"
      first-day-of-week="1"
      v-model="valueInput"
      @input="menu = false"
      scrollable
    >
      <v-spacer/>
    </v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    name: "MenuDatePicker",
    props: {
      value: {
        type: String,
        required: false
      },
      label: {
        type: String,
        default: ""
      },
      allowedDates: {
        type: Function,
        default: () => true
      }
    },
    data() {
      return {
        menu: false
      }
    },
    computed: {
      valueInput: {
        get: function () {
          return this.value;
        },
        set: function (value) {
          this.$emit('input', value);
        }
      }
    }
  }
</script>

<style scoped>

</style>