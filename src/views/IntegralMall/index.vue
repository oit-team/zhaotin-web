<template>
  <div>
    <HeaderNav />
    <div class="main container" style="height:100%;height:calc(100% - 88px)">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'

export default {
  components: {
    HeaderNav,
  },
}
</script>

<style lang='scss' scoped>

</style>
