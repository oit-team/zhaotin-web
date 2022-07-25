<template>
  <div style="height:100%;position:absolute;width:100%">
    <HeaderNav />
    <div class="main container" style="height:100%;height:calc(100% - 110px)">
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
