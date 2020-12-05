<template>
  <v-form class="mt-7 full-width mx-auto" :style="{maxWidth: '1000px'}">
    <v-text-field
      v-model="query"
      placeholder="search for song title"
      solo
      prepend-inner-icon="mdi-magnify"
      height="20px"
      color="primary"
      background-color="background"
      rounded
      full-width
    />
  </v-form>
</template>

<script>
export default {
  data () {
    return {
      query: ''
    }
  }
}
</script>

<style>

</style>
