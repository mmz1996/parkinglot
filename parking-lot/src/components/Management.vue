<template>
  <div class="com-page">
<!--    <sellerpage></sellerpage>-->
<!--    <trendpage></trendpage>-->
    <mappage></mappage>
  </div>
</template>
<script>
import SellerPage from '../view/SellerPage'
import TrendPage from '../view/TrendPage'
import MapPage from '../view/MapPage'
export default {
  components: {
    sellerpage: SellerPage,
    trendpage: TrendPage,
    mappage: MapPage
  },
  props: {},
  name: 'management',
  data () {
    return {}
  },
  methods: {},
  mounted () {}
}
</script>
<style scoped>
</style>
