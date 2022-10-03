<template>
  <v-card elevation="0">
    <v-btn fab small elevation="0" @click="$emit('back')">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-card-title>Report Title</v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="orphans" item-key="id">
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    orphans: {
      type: Array
    }
  },
  data() {
    return {
      headers: [
        // { text: 'DB-ID', value: 'id' },
        { text: 'Code', value: 'orphanCode' },
        { text: 'Name', value: 'firstName' },
        { text: 'Gender', value: 'gender' },
        { text: 'Status', value: 'cod.ss' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>

