<template>
  <div class="com-page">
<!--    <sellerpage></sellerpage>-->
<!--    <trendpage></trendpage>-->
<!--    <mappage></mappage>-->
<!--    <rankpage></rankpage>-->
    <hotpage></hotpage>
  </div>
</template>
<script>
import SellerPage from '../view/SellerPage'
import TrendPage from '../view/TrendPage'
import MapPage from '../view/MapPage'
import RankPage from '../view/RankPage'
import HotPage from '../view/HotPage'
export default {
  components: {
    sellerpage: SellerPage,
    trendpage: TrendPage,
    mappage: MapPage,
    rankpage: RankPage,
    hotpage: HotPage
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
