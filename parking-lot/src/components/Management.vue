<template>
  <div class="com-page">
<!--    <sellerpage></sellerpage>-->
    <trendpage></trendpage>
  </div>
</template>
<script>
import SellerPage from '../view/SellerPage'
import TrendPage from '../view/TrendPage'
export default {
  components: {
    sellerpage: SellerPage,
    trendpage: TrendPage
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
