<template>
  <div>
    <v-dialog v-model="loaderVModel" persistent width="450" dark>
      <v-card>
        <v-card-title>
          <h1 class="mr-16 pr-6">Loading ...</h1>
          <v-progress-circular
            indeterminate
            :width="4"
            :size="50"
            class="ml-n16"
            color="primary"
          ></v-progress-circular>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    loaderVModel: {
      get() {
        return this.$store.getters.getLoadingStatus
      },

      set(payload) {
        return this.$store.commit('SET_LOADING_STATUS', payload)
      }
    }
  }
}
</script>
