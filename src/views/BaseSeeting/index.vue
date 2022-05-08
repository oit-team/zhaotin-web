<template>
  <div style="position: absolute;height: 100%;width: 100%;">
    <HeaderNav class="w-screen mb-4" />
    <div class="main container" style="height: calc(100% - 88px);">
      <!-- <div>基础配置</div> -->
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
.w-screen{
  width: 100%!important;
}
.el-loading-spinner .circular{
  margin:0 auto;
}
</style>
