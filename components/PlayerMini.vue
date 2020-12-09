<template>
  <v-row align="center" justify="center" class="mt-n3">
    <v-col cols="2">
      <v-avatar :color="!music.thumb ? 'primary' : ''" size="62" class="d-block mr-2 mt-n2 ml-auto song-disc" :class="{'active-song': playing }" @click="enterFullScreen">
        <v-img v-if="music.thumb" :src="music.thumb" alt="arioso" />
        <v-icon v-else>
          mdi-music-note-plus
        </v-icon>
      </v-avatar>
    </v-col>

    <v-col cols="10">
      <v-card
        color="background"
        width="100%"
        max-width="800"
        flat
        tile
        height="85"
      >
        <v-row class="mt-n3 pt-4" no-gutters>
          <v-col cols="10" @click="enterFullScreen">
            <v-card-title class="text-body-2 font-weight-medium mt-n3 text-truncate d-block primary--text">
              {{ music.title || 'Last played song title' }}
            </v-card-title>
            <v-card-subtitle class="grey--text text--lighten-1 mt-n4 font-weight-light">
              {{ music.artist || '&lt;unknown&gt;' }}
            </v-card-subtitle>
          </v-col>
          <v-col cols="2">
            <v-btn
              fab
              outlined
              x-small
              color="primary"
              class=" d-block ml-auto mr-4"
              @click="changePlayState"
            >
              <v-icon small>
                {{ playing ? 'mdi-pause' : 'mdi-play' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-text class="d-flex align-center justify-center mt-n9">
          <p class="text-caption font-weight-regular pr-2">
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
          <p class="text-caption pl-2 font-weight-regular mt-n3">
            -{{ audioOutput.remainingTime }}
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    playing: Boolean,
    music: {
      type: Object,
      required: true
    },
    audioOutput: {
      type: Object,
      required: true
    }
  },
  methods: {
    enterFullScreen () {
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
    }
  }
}
</script>

<style>

</style>
