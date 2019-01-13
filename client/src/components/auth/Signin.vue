<template>
  <v-container text-xs-center mt-5 pt-5>

    <!--Signin Title-->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1> Welcome Back!</h1>
      </v-flex>
    </v-layout>

    <!--Error Alert-->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message" />
      </v-flex>
    </v-layout>

    <!--Signin Form-->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="success" dark>
          <v-container>
            <v-form v-model="isFormValid" lazy-validation ref="signinForm" @submit.prevent="handleSigninUser">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules='usernameRules'
                    v-model="username"
                    prepend-icon="face"
                    label="Username"
                    type="text"
                    required
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row mt-4>
                <v-flex xs12>
                  <v-text-field
                    :rules="passwordRules"
                    v-model="password"
                    prepend-icon="extension"
                    label="Password"
                    type="password"
                    required
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn :loading="loading" color="accent" type="submit" :disabled="!isFormValid || loading">
                    <span slot="loader" class="custom-loader"><v-icon light>cached</v-icon></span>
                    Signin
                   </v-btn>

                  <h3>Don't have an account?
                    <router-link to="/signup" style="color:#ffeb3b">Sugnup</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "Signin",

  data() {
    return {
      isFormValid: true,
      username: '',
      password: '',
      usernameRules: [
        // Check if username in input
        username => !!username === true || 'Username is required',
        // Make sure username is less then 10 characters
        username => username.length >= 4 || "Username must be less then 4 characters"
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 4 || 'Password must be at least 4 characters',
      ]
    }
  },

  computed: {
    ...mapGetters(['loading', 'user', 'error'])
  },

  watch: {
    user(value) {
      // if user value changes, redirect to home page
      if (value) this.$router.push('/')
    }
  },

  methods: {
    handleSigninUser() {
      if (this.$refs.signinForm.validate()) {
        this.$store.dispatch('signinUser', {
          username: this.username,
          password: this.password
        })
      }
    }
  }
}
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
