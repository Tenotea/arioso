<template>
  <v-container :style="{maxWidth: '1000px'}" fluid>
    <v-app-bar elevation="0" color="background">
      <v-app-bar-nav-icon color="white" @click="exitFullScreen">
        <v-icon large>
          mdi-chevron-left
        </v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="text-center text-body-1 mt-8" :style="{width: '100%'}">
        {{ music.title || 'Last played song title' }}
        <p class="text-caption">
          {{ music.artist || '&lt;unknown&gt;' }}
        </p>
      </v-toolbar-title>
      <v-app-bar-nav-icon color="white" @click="viewPlaylist = !viewPlaylist">
        <v-icon>
          mdi-playlist-music
        </v-icon>
      </v-app-bar-nav-icon>
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon color="white" v-bind="attrs" v-on="on">
            <v-icon>
              mdi-dots-vertical
            </v-icon>
          </v-app-bar-nav-icon>
        </template>
        <v-list color="background" min-width="150px">
          <v-list-item v-for="option in options" :key="option.id">
            <v-list-item-title @[option.eventName]="() => option.action(music._id)">
              {{ option.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-card
      max-width="600px"
      width="100%"
      color="background"
      tile
      flat
      class="mx-auto mt-12 mt-md-12 "
    >
      <div class="thumbVisser mx-auto mb-13 mb-md-16">
        <v-avatar :color="!music.thumb ? 'primary' : ''" :size="viewPort" md="400" class="d-block song-disc elevation-10" :class="{'active-song': playing}">
          <v-img v-if="music.thumb" :src="music.thumb" alt="arioso" />
          <v-icon v-else x-large>
            mdi-music-note-plus
          </v-icon>
        </v-avatar>
      </div>
      <v-card-text class="d-flex align-center justify-center mt-n4">
        <p class="text-caption font-weight-regular pr-2 mt-n1">
          {{ audioOutput.currentTime }}
        </p>
        <v-slider
          ref="sliderInput"
          v-model="audioOutput.trackPosition"
          color="primary"
          track-color="grey darken-1"
          @click="seeking"
          @start="seekingStart"
          @end="seekingEnd"
        />
        <p class="text-caption pl-2 font-weight-regular mt-n2">
          -{{ audioOutput.remainingTime }}
        </p>
      </v-card-text>
      <v-card-actions class="d-flex align-center justify-space-between mx-auto mt-0 mt-md-5" :style="{maxWidth: '450px'}">
        <v-btn :color="!toLoop ? 'grey darken-4' : 'primary '" fab x-small @click="repeat">
          <v-icon :color="!toLoop ? 'grey lighten-1' : 'white'">
            {{ toLoop === true ? 'mdi-repeat-once' : 'mdi-repeat' }}
          </v-icon>
        </v-btn>
        <v-btn color="grey darken-4" fab small @click="previousTrack">
          <v-icon color="grey lighten-1">
            mdi-skip-previous
          </v-icon>
        </v-btn>
        <v-btn
          color="primary"
          fab
          outlined
          elevation="5"
          @click="changePlayState"
        >
          <v-icon>
            {{ playing ? 'mdi-pause' : 'mdi-play' }}
          </v-icon>
        </v-btn>
        <v-btn color="grey darken-4" fab small @click="nextTrack">
          <v-icon color="grey lighten-1">
            mdi-skip-next
          </v-icon>
        </v-btn>
        <v-btn :color="!shuffled ? 'grey darken-4' : 'primary '" fab x-small @click="shufflePlaylist">
          <v-icon :color="!shuffled ? 'grey lighten-1' : 'white'">
            mdi-shuffle
          </v-icon>
        </v-btn>
      </v-card-actions>
      <v-bottom-sheet v-model="viewPlaylist" scrollable :style="{overflow: 'auto'}">
        <v-card class="px-4 current-playlist" color="background">
          <playlist-view />
        </v-card>
      </v-bottom-sheet>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import musicOptions from '../mixins/musicOptions'
import PlaylistView from './Playlist'
export default {
  components: { PlaylistView },
  mixins: [musicOptions],
  props: {
    playing: Boolean,
    toLoop: {
      type: [Boolean, String],
      default: false
    },
    music: {
      type: Object,
      required: true
    },
    audioOutput: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      shuffled: false,
      viewPlaylist: false
    }
  },
  computed: {
    viewPort () {
      if (window.matchMedia('(min-width: 500px)').matches) {
        return '400'
      } else {
        return '250'
      }
    }
  },
  methods: {
    ...mapActions(['updatePlayingMusic', 'shuffleCurrentPlaylist']),
    exitFullScreen (e) {
      this.$emit('toggleFullScreen')
    },
    changePlayState () {
      this.$emit('changePlayState')
    },
    seeking () {
      const sliderInput = this.$refs.sliderInput
      this.$emit('seeking', sliderInput.value)
    },
    seekingStart () {
      this.$emit('seekingStart')
    },
    seekingEnd () {
      const sliderInput = this.$refs.sliderInput
      this.$emit('seekingEnd', sliderInput.value)
    },
    nextTrack () {
      this.updatePlayingMusic({ next: true })
    },
    previousTrack () {
      this.updatePlayingMusic({ prev: true })
    },
    repeat () {
      this.$emit('loopMusic')
    },
    shufflePlaylist () {
      this.shuffled = !this.shuffled
      this.shuffleCurrentPlaylist(this.shuffled)
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-card.current-playlist {
    overflow: auto !important;
    &::-webkit-scrollbar {
      display: none;
    }
  }
</style>
