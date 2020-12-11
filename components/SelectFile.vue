<template>
  <v-form>
    <v-file-input
      filled
      placeholder="Select music files"
      truncate-length="10"
      chips
      outlined
      color="primary"
      background-color="background"
      prepend-inner-icon="mdi-music-circle"
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
    }
  }
}
</script>
