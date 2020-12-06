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
        <keep-alive>
          <Nuxt />
        </keep-alive>
      </v-container>
    </v-main>
    <v-expand-transition>
      <v-bottom-sheet
        v-model="playerState"
        persistent
        hide-overlay
        no-click-animation
        :fullscreen="isPlayerOpen"
        scrollable
      >
        <v-card
          id="playerCard"
          class="background white--text pt-0"
          height="100"
        >
          <player :is-fullscreen-player="isPlayerOpen" @fullScreen="fullScreenMode" />
        </v-card>
      </v-bottom-sheet>
    </v-expand-transition>
  </v-app>
</template>

<script>
import MusicSearch from '../components/MusicSearch.vue'
import Player from '../components/Player.vue'
import SideNav from '../components/SideNav.vue'
export default {
  components: {
    SideNav,
    MusicSearch,
    Player
  },
  data () {
    return {
      navState: false,
      playerState: true,
      isPlayerOpen: false
    }
  },
  created () {
    this.$store.dispatch('fetchAllMusic')
  },
  methods: {
    fullScreenMode (e) {
      this.isPlayerOpen = !this.isPlayerOpen
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
