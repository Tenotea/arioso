<template>
  <v-list dense>
    <div class="d-flex justify-start align-baseline px-7 mb-8">
      <v-avatar size="30" color="primary d-block" class="mr-5">
        <v-icon color="white" small>
          mdi-music-note-plus
        </v-icon>
      </v-avatar>
      <p class="app-name primary--text">
        Arioso
      </p>
    </div>
    <v-list-item-group>
      <v-list-item
        v-for="menuItem in menu"
        :key="menuItem.id"
        :to="menuItem.route"
        color="primary lighten-2"
      >
        <v-list-item-icon>
          <v-icon v-text="menuItem.icon" />
        </v-list-item-icon>
        <v-list-item-content class="ml-n4">
          <v-list-item-title> {{ menuItem.name }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  data () {
    return {
      menu: [{ id: 1, name: 'My Music', route: '/', icon: 'mdi-headphones' }, { id: 3, name: 'Add music', route: '/add-music', icon: 'mdi-music-note-plus' }]
    }
  }
}
</script>

<style lang="sass" scoped>
  .app-name
    font-family: 'Courgette', roboto
</style>
