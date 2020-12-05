<template>
  <v-container :style="{maxWidth: '1000px'}">
    <audio
      ref="audioOutput"
      :src="currentPlayingMusic && currentPlayingMusic.url"
      :autoplay="currentPlayingMusic"
      hidden
      @playing="playing = true"
      @timeupdate="updateTrackPosition"
      @ended="playing = false, nextTrack()"
    />
    <player-mini
      v-if="!isFullscreenPlayer"
      :music="currentPlayingMusic || {}"
      :audio-output="audioOutput"
      :playing="playing"
      @enterFullScreen="goFullScreen"
      @changePlayState="changePlayState"
      @seeking="seeking"
      @seekingStart="seekingStart"
      @seekingEnd="seekingEnd"
    />
    <player-fullscreen
      v-if="isFullscreenPlayer"
      :music="currentPlayingMusic || {}"
      :audio-output="audioOutput"
      :playing="playing"
      @exitFullScreen="goFullScreen"
      @changePlayState="changePlayState"
      @seeking="seeking"
      @seekingStart="seekingStart"
      @seekingEnd="seekingEnd"
    />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PlayerFullscreen from './PlayerFullscreen.vue'
import PlayerMini from './PlayerMini'
export default {
  components: { PlayerFullscreen, PlayerMini },
  props: {
    isFullscreenPlayer: Boolean
  },
  data () {
    return {
      audioOutput: {
        trackPosition: 0,
        currentTime: '0:00',
        remainingTime: '0:00'
      },
      playing: false,
      isAudioSeeking: false
    }
  },
  computed: {
    ...mapState(['currentPlayingMusic']),
    trackPosition: {
      get () {
        return this.audioOutput.trackPosition
      },
      set (position) {
        this.audioOutput.trackPosition = position
      }
    }
  },
  methods: {
    ...mapActions(['updatePlayingMusic']),
    convertToMinutes (secs) {
      const minutes = Math.floor(secs / 60)
      const seconds = Math.floor(secs - (minutes * 60))
      if (isNaN(minutes) || isNaN(seconds)) {
        return '0:00'
      } else {
        return `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`
      }
    },
    updateTrackPosition (e) {
      const trackDuration = e.target.duration
      const currentTime = e.target.currentTime
      !this.isAudioSeeking && (this.audioOutput.trackPosition = (currentTime / trackDuration) * 100)
      this.audioOutput.currentTime = this.convertToMinutes(currentTime)
      this.audioOutput.remainingTime = this.convertToMinutes(trackDuration - currentTime)
    },
    seeking (value) {
      const audEl = this.$refs.audioOutput
      const currentTime = (audEl.duration * value) / 100
      audEl.currentTime = currentTime
      // audEl.play() //This makes playing take action when the audio duration changes
    },
    seekingStart (e) {
      this.isAudioSeeking = true
    },
    seekingEnd (value) {
      this.isAudioSeeking = false
      this.seeking(value)
    },
    changePlayState () {
      const audEl = this.$refs.audioOutput
      this.playing = !this.playing
      !this.playing ? audEl.pause() : audEl.play()
    },
    goFullScreen () {
      this.$emit('fullScreen')
    },
    nextTrack () {
      this.updatePlayingMusic({ next: true })
    }
  }
}
</script>

<style lang="sass">
  .v-btn--round
    &.play_pause
      height: 32px !important
      width: 32px !important
      border-radius: 50% !important
</style>
