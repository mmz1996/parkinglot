<template>
  <div class="com-page">
    <singlemap></singlemap>
  </div>
</template>

<script>
import Map from '../components/Map'
export default {
  name: 'MapPage',
  components: {
    singlemap: Map
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
