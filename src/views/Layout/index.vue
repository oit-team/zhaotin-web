<template>
  <div>
    <HeaderNav />
    <HeaderMsg />
    <div class="main container">
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderNav from './components/HeaderNav'
import HeaderMsg from './components/HeaderMsg'

export default {

  components: {
    HeaderNav,
    HeaderMsg,
  },
}
</script>

<style>
.main {
  position: relative;
  min-height: 600px;
}
</style>
