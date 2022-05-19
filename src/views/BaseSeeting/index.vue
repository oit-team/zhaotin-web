<template>
  <div style="position: absolute;height: 100%;width: 100%;">
    <HeaderNav class="w-screen mb-4" />
    <div class="main container scrollbar" style="height: calc(100% - 88px);overflow:auto">
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
  min-height: 500px;
}
.w-screen{
  width: 100%!important;
}
.el-loading-spinner .circular{
  margin:0 auto;
}
/* 自定义滚动条 */
.scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: transparent;
}

.scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(69, 90, 100, .2);
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: transparent;
}
</style>
