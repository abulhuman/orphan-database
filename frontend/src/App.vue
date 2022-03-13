<template>
  <v-app>
    <Loader />
    <v-main class="max-width: 100%;" style="background: #eee;">
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
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import Loader from './components/Loader.vue'
import store from './store'
export default {
  components: { Loader },
  name: 'App',
  created() {
    axios.interceptors.request.use(
      (config) => {
        store.commit('SET_LOADING_STATUS', true)
        return config
      },
      (error) => {
        store.commit('SET_LOADING_STATUS', false)

        // TODO create logout mutation/action then re-route to login page
        // this.$router.push({ name: 'login' })
        
        return Promise.reject(error)
      }
    )

    axios.interceptors.response.use(
      (response) => {
        store.commit('SET_LOADING_STATUS', false)
        return response
      },
      (error) => {
        // TODO create logout mutation/action then re-route to login page
        // this.$router.push({ name: 'login' })
        
        store.commit('SET_LOADING_STATUS', true)
        return error
      }
    )
  },
  computed: {
    ...mapGetters(['getSnackbarColor', 'getSnackbarText']),
    getSnackbar: {
      get: () => store.getters.getSnackbar,
      set: (payload) => store.commit('SET_SNACKBAR', payload)
    }
  },
  methods: {
    ...mapMutations(['SET_SNACKBAR', 'SET_SNACKBAR_COLOR', 'SET_SNACKBAR_TEXT'])
  }
}
</script>
