<template>
  <v-container>
    <v-text-field v-model="title" label="Song Title" outlined prepend-inner-icon="mdi-file-music" color="blue-grey darken-2" />
    <v-text-field
      v-model="audioFile.size"
      label="File Size"
      outlined
      color="blue-grey darken-2"
      prepend-inner-icon="mdi-resize"
    />
  </v-container>
</template>

<script>
export default {
  props: {
    audioFile: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      title: ''
    }
  }
}
</script>

<style>

</style>
