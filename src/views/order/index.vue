<template>
  <div>
    <HeaderNav class="mb-4" />
    <div class="main container">
      <div>
        <TablePage v-bind="tablePageOption" auto />
      </div>
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
import TablePage from '@/components/business/TablePage'

export default {
  components: {
    HeaderNav,
    TablePage,
  },
}
</script>

<style>
.main {
  min-height: 600px;
}
</style>
