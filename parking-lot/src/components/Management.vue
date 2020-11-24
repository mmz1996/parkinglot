<template>
  <div class="com-management">
    <sellerpage></sellerpage>
  </div>
</template>
<script>
  import SellerPage from '../view/SellerPage'
  export default {
    components: {
      sellerpage: SellerPage
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
  .com-management{
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
</style>
