<template>
  <div>
    <HeaderNav />
    <table-page v-bind="tablePageOption" auto ref="page" />
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
import TablePage from '@/components/business/TablePage'
import { reqGetProductList } from '@/api/product'

export default {
  components: {
    HeaderNav,
    TablePage,
  },

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        // actions: [
        //   {
        //     name: '导出数据',
        //     type: 'primary',
        //     click: () => this.$refs.export.open(),
        //   },
        // ],
        table: {
          // data: this.data.resultList,
        },
        pager: {
          // total: this.data.totalCount,
        },
      }
    },
  },
  // created() {
  //   reqGetFildes({
  //     styleNo: '',
  //     pageNum: '1',
  //     pageSize: '2',
  //     userId: '1',
  //   })
  // },
  methods: {
    async loadData(con) {
      // this.dispatch('user/getuserinfo', con)
      const res = await reqGetProductList(con)
      this.data = res.body
      console.log(this.data.resultList)
    },

  },

}
</script>

<style>

</style>
