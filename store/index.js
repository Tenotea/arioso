import Vue from 'vue'
import Vuex from 'vuex'
import localForage from 'localforage'
Vue.use(Vuex)

export default () => new Vuex.Store({
  state: {
    allMusic: [],
    currentPlayingMusic: { },
    lastPlayedMusic: {},
    currentPlayingIndex: null,
    currentPlaylist: null
  },
  mutations: {
    allMusic (state, payload) {
      state.allMusic = payload
    },
    currentPlayingMusic (state, payload) {
      payload && (state.currentPlayingMusic = payload)
      // state.lastPlayedMusic = payload
    },
    currentPlaylist (state, payload) {
      state.currentPlaylist = payload
      state.currentPlayingIndex = payload.findIndex(({ _id }) => state.currentPlayingMusic._id === _id)
    },
    currentPlayingIndex (state, payload) {
      if (typeof payload === 'number') {
        state.currentPlayingIndex = payload
      } else if (payload === 'next') {
        state.currentPlayingIndex++
      } else {
        state.currentPlayingIndex--
      }
    }
  },
  actions: {
    fetchAllMusic (context, playlist) {
      const musicstore = []
      localForage.iterate((value, key, index) => {
        musicstore.push(value)
      }).then(() => {
        context.commit('allMusic', musicstore)
        context.commit('currentPlaylist', playlist || musicstore)
      })
    },

    updatePlayingMusic ({ commit, state }, data) {
      // The data property will come with an album name
      // Acommpanied by the song to play
      if (data.next) {
        if (state.currentPlayingIndex < state.currentPlaylist.length - 1) {
          commit('currentPlayingIndex', 'next')
        } else {
          commit('currentPlayingIndex', 0)
        }
        commit('currentPlayingMusic', state.currentPlaylist[state.currentPlayingIndex])
      } else if (data.prev) {
        if (state.currentPlayingIndex > 0) {
          commit('currentPlayingIndex', 'prev')
          commit('currentPlayingMusic', state.currentPlaylist[state.currentPlayingIndex])
        }
      } else {
        commit('currentPlayingMusic', data.music)
        commit('currentPlaylist', data.album || state.allMusic)
      }
    }
  }
})
