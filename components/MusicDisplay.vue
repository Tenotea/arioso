<template>
  <div :style="{maxWidth: '1300px'}" class="mx-auto">
    <v-hover v-slot="{ hover }">
      <v-card
        class="background px-2"
        tile
        flat
        :color="(hover || playing) ? 'grey darken-4' : 'background'"
        style="transition: background 200ms ease-out"
        @click="playMusic"
      >
        <v-row align="center" justify="space-between" no-gutters>
          <v-col cols="2" md="1">
            <v-avatar :color="`${!music.thumb && 'primary'} d-block`">
              <v-img v-if="music.thumb" :src="music.thumb" />
              <v-icon v-else color="white" small>
                mdi-music-note-plus
              </v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="8" md="10">
            <v-card-title class="text-truncate text-subtitle-2 d-block" :class="`${playing ? 'primary--text font-weight-medium text-body-2' : 'grey--text text--lighten-3 font-weight-regular'}`">
              {{ music.title }}
            </v-card-title>
            <v-card-subtitle class="pt-1 font-weight-light text-caption" :class="`${playing ? 'primary--text' : 'grey--text text--lighten-1'}`">
              {{ music.artist || '&lt;unknown&gt;' }}
              <v-icon size="5" class="pl-2" :color="playing ? 'primary' : 'grey'">
                mdi-circle
              </v-icon>
              <span class="pl-2" :class="`${playing ? 'primary--text' : 'grey--text text--lighten-1'}`">
                {{ music.duration }}
              </span>
            </v-card-subtitle>
          </v-col>
          <v-col cols="2" md="1" class="music-options">
            <v-card-actions class="music-options">
              <v-menu transition="slide-y-transition" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="music-options"
                    fab
                    color="transparent"
                    elevation="0"
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon :color="playing ? 'primary' : 'white'" small class="music-options">
                      mdi-dots-vertical
                    </v-icon>
                  </v-btn>
                </template>
                <v-list color="background" min-width="150px">
                  <v-list-item
                    v-for="option in options"
                    :key="option.id"
                  >
                    <v-list-item-title @[option.eventName]="option.action">
                      {{ option.name }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-hover>
    <v-divider dark />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    music: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      options: [
        {
          id: 1,
          name: 'Delete',
          eventName: 'click',
          action: () => {
            this.deleteMusicItem(this.music._id)
          }
        }
      ]
    }
  },
  computed: {
    playing () {
      return this.$store.state.currentPlayingMusic && (this.$store.state.currentPlayingMusic._id === this.music._id)
    }
  },
  methods: {
    ...mapActions(['updatePlayingMusic', 'deleteMusicItem']),
    playMusic (e) {
      if (!e.target.classList.contains('music-options')) {
        this.updatePlayingMusic({ music: this.music })
      } else {
        // Open options
      }
    }
  }
}
</script>

<style>

</style>
