<template>
  <v-container color="background" class="d-flex align-center justify-center" fluid>
    <v-card max-width="600px" tile color="background" class="px-4 px-md-8 py-6">
      <v-card-title v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </v-card-title>
      <v-card-title v-else>
        {{ otherError }}
      </v-card-title>
      <v-card-subtitle>
        Your're supposed to be seeing this page but of you are then Tenotea messed up (Sorry).
      </v-card-subtitle>
      <v-btn to="/" color="primary px-3">
        Go Home
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
