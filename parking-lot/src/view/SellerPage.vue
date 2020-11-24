<template>
  <div class="com-page">
    <seller></seller>
  </div>
</template>

<script>
import Seller from '../components/Seller'
export default {
  name: 'SellerPage',
  components: {
    seller: Seller
  }
}
</script>

<style scoped>

  .com-page {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
