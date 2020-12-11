export default {
  data () {
    return {
      options: [
        {
          id: 1,
          name: 'Delete',
          eventName: 'click',
          action: (id) => {
            this.$store.dispatch('deleteMusicItem', id)
          }
        }
      ]
    }
  }
}
