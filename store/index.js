import Vue from 'vue'
import Vuex from 'vuex'
import localForage from 'localforage'
import shuffler from 'array-shuffle'
Vue.use(Vuex)

export default () => new Vuex.Store({
  state: {
    allMusic: [],
    currentPlayingMusic: { },
    currentPlayingIndex: null,
    currentPlaylist: null,
    fetchError: null,
    deleteError: null
    // lastPlayedMusic: {}, // A feature for later
  },

  mutations: {
    allMusic (state, payload) {
      state.allMusic = payload.sort((a, b) => a.title > b.title ? 1 : -1)
      // try {
      //   state.allMusic = payload.sort((a, b) => a.title > b.title ? 1 : -1)
      // } catch (exception) {
      //   state.allMusic = payload
      // }
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
    },

    mutFetchError (state, payload) {
      state.fetchError = payload
    },

    mutDeleteError (state, payload) {
      state.deleteError = payload
    }
  },

  actions: {
    fetchAllMusic (context, playlist) {
      context.commit('mutFetchError', null)
      const musicstore = []
      localForage.iterate((value, key, index) => {
        musicstore.push(value)
      }).then(() => {
        if (musicstore.length < 1) {
          context.commit('allMusic', [])
        } else {
          context.commit('allMusic', musicstore)
          context.commit('currentPlaylist', playlist || musicstore)
        }
      }).catch(() => {
        context.commit('mutFetchError', ['Failed to fetch music files'])
      })
    },

    updatePlayingMusic ({ commit, state }, data) {
      if (data.next || data.prev) {
        if (state.currentPlayingIndex < state.currentPlaylist.length - 1 && data.next) {
          commit('currentPlayingIndex', 'next')
        } else if (state.currentPlayingIndex > 0 && data.prev) {
          commit('currentPlayingIndex', 'prev')
        } else {
          commit('currentPlayingIndex', 0)
        }
        commit('currentPlayingMusic', state.currentPlaylist[state.currentPlayingIndex])
      } else {
        commit('currentPlayingMusic', data.music)
        commit('currentPlaylist', data.album || state.allMusic)
      }
    },

    deleteMusicItem ({ dispatch, commit }, id) {
      commit('mutDeleteError', null)
      localForage.removeItem(id).then(() => {
        const updatedMusics = this.state.allMusic.filter(music => music._id !== id)
        commit('allMusic', updatedMusics)
      }).catch(() => {
        commit('mutDeleteError', ['Failed to delete music'])
      })
    },

    shuffleCurrentPlaylist ({ state, commit }, shuffle) {
      if (shuffle) {
        commit('currentPlaylist', shuffler(state.currentPlaylist))
      } else {
        commit('currentPlaylist', state.allMusic)
      }
    }
  },

  getters: {
    getAllMusics: state => state.allMusic
  }
})
