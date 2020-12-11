<template>
  <v-dialog v-model="applicationError" width="fit-content">
    <v-card max-width="600px" class="mx-auto" color="background">
      <v-card-title>
        <v-subheader> {{ errors.length }} ERROR(S) OCCURED </v-subheader>
        <v-spacer />
        <v-btn fab color="transparent" elevation="0" small>
          <v-icon color="primary" @click="applicationError = false">
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-list dense color="background">
        <v-list-item v-for="(error, i) in errors" :key="i">
          <v-list-item-icon>
            <v-icon size="6">
              mdi-circle
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle> {{ error }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <slot />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      applicationError: true
    }
  }
}
</script>
