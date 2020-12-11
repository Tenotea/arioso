<template>
  <v-container class="mt-15 pa-0 gray lighten-5" fluid>
    <v-card
      max-width="600px"
      width="100%"
      color="background"
      class="mx-auto pa-2 pa-md-6"
      tile
      flat
    >
      <v-card-title class="mb-5 ml-n2">
        {{ !uploading ? 'Upload Music' :
          uploadCount === 100 ? 'Uploaded Music' :
          'Uploading Music' }}
      </v-card-title>
      <select-file v-if="!uploading" @fileChange="fillAudioFiles" />
      <v-btn
        v-if="!uploading"
        color="primary"
        class="white--text mt-5"
        block
        @click="uploadAudioFiles"
      >
        Upload
        <v-icon color="white" small right>
          mdi-upload
        </v-icon>
      </v-btn>
      <v-progress-circular
        v-else
        :color="uploadCount === 100 ? 'green accent-4' : 'primary'"
        :indeterminate="uploadCount < 1"
        :value="uploadCount"
        width="5"
        size="70"
        rotate="-90"
        class="mx-auto d-flex"
      >
        {{ Math.floor(uploadCount) }}%
      </v-progress-circular>
      <v-card-actions>
        <v-btn
          v-if="uploadCount === 100"
          color="primary"
          rounded
          class="px-4 mx-auto mt-5"
          @click="reset()"
        >
          Upload again
        </v-btn>
      </v-card-actions>
    </v-card>
    <error-dialog v-if="uploadCount === 100 && errors.length > 0" :errors="errors" />
  </v-container>
</template>

<script>
import { randomBytes } from 'crypto'
import jsmediatags from 'jsmediatags'
import localForage from 'localforage'
import SelectFile from '../components/SelectFile'
import ErrorDialog from '../components/ErrorDialog'
export default {
  components: {
    SelectFile,
    ErrorDialog
  },

  data () {
    return {
      filesToUpload: [],
      uploading: false,
      uploadCount: 0,
      errors: []
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
                    this.storeAudioFile(musicData).catch(() => {
                      this.errors.push(`Failed to upload ${musicData.title}`)
                    }).finally(() => {
                      this.uploadCount += fillFraction
                      if (index === (this.filesToUpload.length - 1)) {
                        this.$store.dispatch('fetchAllMusic')
                      }
                    })
                  },
                  onError: () => {
                    this.storeAudioFile(musicData).catch(() => {
                      this.errors.push(`Failed to upload ${musicData.title}`)
                    }).finally(() => {
                      this.uploadCount += fillFraction
                      if (index === (this.filesToUpload.length - 1)) {
                        this.$store.dispatch('fetchAllMusic')
                      }
                    })
                  }
                })
              })
              audioPlayer.addEventListener('error', (playerErrorEvent) => {
                this.uploadCount += fillFraction
                this.errors.push(`Failed to read ${musicData.title}. File could be corrupt`)
                if (index === (this.filesToUpload.length - 1)) {
                  this.$store.dispatch('fetchAllMusic')
                }
              })
            })
          })
        } catch (error) {
          this.errors.push('An unexpected error occured')
        }
      }
    },

    convertToMinutes (secs) {
      const minutes = Math.floor(secs / 60)
      const seconds = Math.floor(secs - (minutes * 60))
      return `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`
    },

    storeAudioFile (musicFile) {
      return localForage.setItem(musicFile._id, musicFile)
    },

    reset () {
      this.uploadCount = 0
      this.filesToUpload = []
      this.uploading = false
      this.errors = []
    }
  }
}
</script>

<style>

</style>
