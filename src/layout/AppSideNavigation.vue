<template>
  <v-navigation-drawer
    id="sideNav"
    app
    clipped
    expand-on-hover
  >
    <v-list>
      <v-list-item class="px-2" link>

        <v-list-item-avatar>
          <v-avatar
            left
            color="primary"
          >
            <span class="white--text headline">{{username.charAt(0).toUpperCase()}}</span>
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="title">{{username}}</v-list-item-title>
        </v-list-item-content>

      </v-list-item>
    </v-list>

    <v-divider/>

    <v-list
      nav
      dense
    >
      <v-list-item
        v-for="(item, i) in navigationItems"
        :key="i"
        :to="item.link"
        link
      >
        <v-list-item-icon>
          <v-icon>{{item.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{item.title}}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list dense>
        <v-list-item v-on:click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Выйти</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import {AUTH_LOGOUT} from "../data/constants/auth_constants";

  export default {
    name: "AppSideNavigation",
    computed: {
      navigationItems() {
        return [
          {title: "Teams", icon: "mdi-account-multiple", link: "/teams", available: this.isTeamsAvailable},
        ].filter(it => it.available)
      },
      username() {
        return this.$store.getters.username;
      },
      isTeamsAvailable() {
        return this.$store.getters.isAdmin;
      }
    },
    methods: {
      logout: function () {
        this.$store.dispatch(AUTH_LOGOUT).then(() => {
          this.$router.push("/login");
        });
      }
    }
  }
</script>

<style scoped>
</style>