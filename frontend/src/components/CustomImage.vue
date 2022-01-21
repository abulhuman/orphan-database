<template>
  <div>
    <template>
      <v-img
        :src="src"
        :max-width="maxWidth"
        v-if="type === 'EDR'"
        @error="error()"
      ></v-img
    ></template>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["url", "type"],
  computed: {
    src() {
      return `${axios.defaults.baseURL}${this.url.slice(
        this.url.indexOf("/")
      )}`;
    },
    maxWidth() {
      // add long image type later
      if (this.type === "EDR") {
        return "925px";
      }

      return "50%";
    }
  },
  methods: {
    error() {
      this.$emit("badUrl");
    }
  }
};
</script>

<style></style>
