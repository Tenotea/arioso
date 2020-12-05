<template>
  <v-form>
    <v-file-input
      solo
      truncate-length="30"
      chips
      label="Select a song"
      color="primary"
      prepend-inner-icon="mdi-music-note-plus"
      :prepend-icon="null"
      multiple
      @change="fileInputChange"
    >
      <template v-slot:selection="{ text }">
        <v-chip small color="primary" class="white--text">
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>
  </v-form>
</template>

<script>
export default {
  methods: {
    fileInputChange (e) {
      this.$emit('fileChange', e)
    },
    proceed () {
      this.$emit('proceedToStore')
    }
  }
}
</script>

<style>

</style>
