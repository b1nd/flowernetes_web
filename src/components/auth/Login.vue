<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12" @keyup.enter="doLogin">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer/>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    required
                    :rules="required('Login')"
                    v-model="login"
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    required
                    autocomplete="on"
                    :rules="required('Password')"
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn
                  color="primary"
                  v-on:click="doLogin"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-snackbar
              class="custom-width"
              v-model="badCredentials"
              color="error"
              :timeout="3000"
            >
              Bad credentials
            </v-snackbar>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import {AUTH_REQUEST} from "../../data/constants/auth_constants";
  import {Credentials} from "../../data/dto/auth_dto";
  import {requiredField} from "../../utils/validation";

  export default {
    data: () => ({
      login: '',
      password: '',
      badCredentials: false
    }),
    methods: {
      doLogin: function () {
        const {login, password} = this;
        this.$store.dispatch(AUTH_REQUEST, new Credentials(login, password)).then(() => {
          this.badCredentials = false;
          this.$router.push("/");
        }).catch(() => {
          this.password = '';
          this.badCredentials = true;
        });
      },
      required: function (name) {
        return requiredField(name);
      }
    }
  }
</script>

<style scoped>
  .custom-width >>> .v-snack__wrapper {
    min-width: 130px;
    max-width: 130px;
  }
</style>