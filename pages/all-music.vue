<template>
  <v-container>
    <music-display v-for="music in availableMusic" :key="music._id" :music="music" />
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
