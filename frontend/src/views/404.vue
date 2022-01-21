<template>
  <v-container grid-list-xs>
    <v-card>
      <v-card-title primary-title>
        <h1 class="error--text">Error 404 - Page Not Found!</h1>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="info" @click="$router.push('/')"
          ><v-icon class="mr-2">mdi-arrow-left</v-icon>Back to safety</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>
