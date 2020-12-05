<template>
  <v-container class="mt-10 px-8 gray lighten-5" fluid>
    <v-card max-width="600px" width="100%" class="mx-auto pa-2 pa-md-6">
      <v-card-title> {{ !uploading ? 'Upload Music' : 'Uploading Music' }} </v-card-title>
      <select-file v-if="!uploading" @fileChange="fillAudioFiles" />
      <v-btn
        v-if="!uploading"
        color="primary"
        class="white--text"
        block
        rounded
        @click="uploadAudioFiles"
      >
        Upload
        <v-icon color="white" small right>
          mdi-upload
        </v-icon>
      </v-btn>
      <v-progress-circular
        v-else
        color="primary"
        :indeterminate="uploadCount < 1"
        :value="uploadCount"
        width="5"
        size="70"
        rotate="-90"
        class="mx-auto d-flex"
      >
        {{ uploadCount.toFixed(1) }}%
      </v-progress-circular>
    </v-card>
  </v-container>
</template>

<script>
/* eslint-disable no-console */
import { randomBytes } from 'crypto'
import jsmediatags from 'jsmediatags'
import localForage from 'localforage'
import SelectFile from '../components/SelectFile'

export default {
  components: {
    SelectFile
  },

  data () {
    return {
      filesToUpload: [],
      uploading: false,
      uploadCount: 0
    }
  },

  methods: {
    fillAudioFiles (files) {
      this.uploadCount = 0
      this.filesToUpload = files.slice()
    },

    uploadAudioFiles () {
      if (this.filesToUpload.length > 0) {
        try {
          this.uploading = true
          this.uploadCount = 0
          const fillFraction = 100 / this.filesToUpload.length
          this.filesToUpload.forEach((file, index) => {
            const musicData = {
              _id: randomBytes(16).toString('hex'),
              title: file.name,
              thumb: undefined,
              album: 'arioso',
              artist: 'unknown',
              tis: 0,
              duration: '',
              url: '',
              timeCreated: Date.now()
            }
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.addEventListener('load', (readerEvent) => {
              musicData.url = readerEvent.target.result
              const audioPlayer = document.createElement('audio')
              audioPlayer.src = musicData.url
              audioPlayer.addEventListener('loadedmetadata', () => {
                musicData.tis = audioPlayer.duration
                musicData.duration = this.convertToMinutes(audioPlayer.duration)
                jsmediatags.read(file, {
                  onSuccess: ({ tags }) => {
                    const { title, album, artist, picture } = tags
                    title && (musicData.title = title)
                    album && (musicData.album = album)
                    artist && (musicData.artist = artist)
                    if (picture) {
                      let base64String = ''
                      picture.data.forEach((char) => {
                        base64String += String.fromCharCode(char)
                      })
                      const base64Image = `data:${tags.picture.format};base64,${window.btoa(base64String)}`
                      musicData.thumb = base64Image
                    }
                    this.storeAudioFile(musicData).then(() => {
                      this.uploadCount += fillFraction
                      if (index === (this.filesToUpload.length - 1)) {
                        this.uploading = false
                        this.$store.dispatch('fetchAllMusic')
                      }
                    })
                  },
                  onError: () => {
                    this.storeAudioFile(musicData).then(() => {
                      this.uploadCount += fillFraction
                      if (index === (this.filesToUpload.length - 1)) {
                        this.uploading = false
                        this.$store.dispatch('fetchAllMusic')
                      }
                    })
                  }
                })
              })
              audioPlayer.addEventListener('error', (playerErrorEvent) => {
                this.uploadCount += fillFraction
                if (index === (this.filesToUpload.length - 1)) {
                  this.uploading = false
                  this.$store.dispatch('fetchAllMusic')
                }
                throw new Error('Could not load ' + file.name)
              })
            })
          })
        } catch (error) {
          console.log(error.message)
        }
      }
    },
    // Method
    convertToMinutes (secs) {
      const minutes = Math.floor(secs / 60)
      const seconds = Math.floor(secs - (minutes * 60))
      return `${minutes}:${seconds > 10 ? seconds : `0${seconds}`}`
    },
    // Method
    storeAudioFile (musicFile) {
      return localForage.setItem(musicFile._id, musicFile)
    }
  }
}
</script>

<style>

</style>
