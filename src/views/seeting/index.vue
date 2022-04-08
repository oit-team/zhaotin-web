<template>
  <div>
    <HeaderNav class="mb-4" />
    <div class="main container">
      <!-- <table-page v-bind="tablePageOption" auto ref="page" /> -->
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
// import TablePage from '@/components/business/TablePage'

export default {
  components: {
    HeaderNav,
    // TablePage,
  },
  data() {
    return {
      data: {},
    }
  },

}
</script>

<style>
.main {
  min-height: 600px;
}
</style>
