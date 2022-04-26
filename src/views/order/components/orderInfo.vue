<template>
  <div>
    <HeaderNav class="mb-4" />
    <div class="main container">
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
