<template>
  <v-container>
    <v-container v-if="availableMusic === 'empty'" class="d-flex align-center justify-center flex-column" :style="{minHeight: '80vh'}">
      <empty-songs-list />
    </v-container>
    <v-container v-else-if="availableMusic.length > 0">
      <music-display v-for="music in availableMusic" :key="music._id" :music="music" />
    </v-container>
    <v-container v-else class="d-flex align-center justify-center flex-column" :style="{minHeight: '80vh'}">
      <v-subheader> Loading your Music </v-subheader>
      <v-progress-linear indeterminate :style="{maxWidth: '500px'}" />
    </v-container>
  </v-container>
</template>

<script>
import MusicDisplay from '../components/MusicDisplay.vue'
export default {
  components: { MusicDisplay },
  data () {
    return {}
  },
  computed: {
    availableMusic () {
      return this.$store.state.allMusic
    }
  }
}
</script>

<style>

</style>
