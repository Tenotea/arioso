<template>
  <v-list dense color="background">
    <v-subheader> CURRENT PLAYLIST </v-subheader>
    <template v-for="(music, i) in playlist">
      <v-list-item :key="music._id" @click="changePlayingMusic(music, playlist)">
        <v-list-item-icon>
          <v-icon small color="primary">
            mdi-music-circle
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle :class="`text-truncate d-block ${playing._id === music._id ? 'primary--text' : ''}`">
            {{ music.title }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="i" />
    </template>
  </v-list>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      playlist: 'currentPlaylist',
      playing: 'currentPlayingMusic'
    })
  },
  methods: {
    ...mapActions({
      updateMusic: 'updatePlayingMusic'
    }),
    changePlayingMusic (music, album) {
      this.updateMusic({ music, album })
    }
  }
}
</script>
