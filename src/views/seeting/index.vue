<template>
  <div>
    <HeaderNav />
    <div class="main container">
      <div>系统设置</div>
      <!-- 出口 -->
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

<style>
.main {
  min-height: 600px;
}
</style>
