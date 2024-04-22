<template>
</template>

<script>
  import api from '../../api.js'

  export default {
    mounted () {
      api.logout().then(res => {
        this.$store.dispatch('clearProfile')
        this.$store.dispatch('clearToken')
        this.$router.replace({
          path: '/'
        })
      })
    }
  }
</script>
