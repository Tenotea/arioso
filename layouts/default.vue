<template>
  <v-app class="background">
    <v-app-bar app color="background" class="pl-md-7 pl-2 pt-4" elevate-on-scroll>
      <v-app-bar-nav-icon color="primary" class="mt-n3" @click="navState = !navState" />
      <v-container>
        <music-search />
      </v-container>
    </v-app-bar>
    <v-navigation-drawer
      v-model="navState"
      color="background"
      class="pt-4"
      app
      :overlay-opacity="0"
    >
      <side-nav />
    </v-navigation-drawer>
    <v-main color="background">
      <v-container class="pt-5 background" style="min-height: 100vh; padding-bottom: 100px;" fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-expand-transition v-if="playerState">
      <div tabindex="-1" class="v-dialog__content v-dialog__content--active">
        <transition name="bottom-sheet-transition">
          <div :class="`v-dialog v-bottom-sheet v-dialog--active v-dialog--persistent ${isFullScreenPlayerOpen && 'v-dialog--fullscreen'}`" style="{ transformOrigin:'center center'}">
            <v-card
              id="playerCard"
              class="background white--text pt-0"
              height="100"
              width="100%"
            >
              <player :is-fullscreen-player="isFullScreenPlayerOpen" @fullScreen="fullScreenMode" />
            </v-card>
          </div>
        </transition>
      </div>
    </v-expand-transition>
    <error-dialog v-if="fetchError && fetchError.length > 0" :errors="fetchError">
      <v-btn
        v-if="fetchError"
        text
        small
        class="ml-auto font-weight-medium"
        color="primary"
        @click="fetchMusic"
      >
        Retry
      </v-btn>
    </error-dialog>
    <error-dialog v-if="deleteError && deleteError.length > 0" :errors="deleteError" />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import ErrorDialog from '../components/ErrorDialog.vue'
import MusicSearch from '../components/MusicSearch.vue'
import Player from '../components/Player.vue'
import SideNav from '../components/SideNav.vue'
export default {
  components: {
    SideNav,
    MusicSearch,
    Player,
    ErrorDialog
  },

  data () {
    return {
      navState: false,
      isFullScreenPlayerOpen: false
    }
  },
  computed: {
    ...mapState(['fetchError', 'deleteError', 'currentPlayingMusic']),
    playerState () {
      return this.$store.state.currentPlayingMusic._id !== undefined
    }
  },
  created () {
    this.fetchMusic()
  },
  methods: {
    fullScreenMode (e) {
      this.isFullScreenPlayerOpen = !this.isFullScreenPlayerOpen
    },
    fetchMusic () {
      this.$store.dispatch('fetchAllMusic')
      this.$store.commit('mutFetchError', null)
    }
  },
  head () {
    return {
      title: this.currentPlayingMusic.title && this.currentPlayingMusic.title + ' - Arioso Music Player'
    }
  }
}
</script>

<style>
  .white--text.site-name{
    font-family: 'Courgette';
    font-size: 1.5em;
  }
  .active-song{
    animation: rotateDisc 10s linear 0s infinite forwards !important;
    transform-style: preserve-3d !important;
    transform-origin: center !important;
  }
  @keyframes rotateDisc {
    from {
      transform: rotate(0deg);
    } to {
      transform: rotate(360deg);
    }
  }
  .thumbVisser {
    width: fit-content;
    height: fit-content;
    border: 5px solid rgb(66, 66, 66);
    border-radius: 50% !important;
    padding: 7px 9px;
  }
</style>
