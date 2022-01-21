<template>
  <v-app>
    <v-main class="max-width: 100%;" style="background: #eee;">
      <!-- style="background-image: linear-gradient(to bottom right, rgba(100,115,201,.6), rgba(25,32,72,1);" -->
      <router-view />
      <v-snackbar
        v-model="getSnackbar"
        top
        right
        :color="getSnackbarColor"
        timeout="6000"
        class="mt-16"
      >
        <v-row>
          <div class="ml-2">{{ getSnackbarText }}</div>
          <v-spacer></v-spacer>
          <v-hover v-slot="{ hover }">
            <v-icon
              :color="hover ? 'red lighten-3' : 'gray lighten-3'"
              @click="SET_SNACKBAR(false)"
              right
            >
              mdi-close</v-icon
            >
          </v-hover></v-row
        >
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import store from "./store";
export default {
  name: "App",

  data: () => ({
    //
    valueChanger: false
  }),
  computed: {
    ...mapGetters(["getSnackbarColor", "getSnackbarText"]),
    getSnackbar: {
      get: () => store.getters.getSnackbar,
      set: payload => store.commit("SET_SNACKBAR", payload)
    }
  },
  methods: {
    ...mapMutations(["SET_SNACKBAR", "SET_SNACKBAR_COLOR", "SET_SNACKBAR_TEXT"])
  }
};
</script>
