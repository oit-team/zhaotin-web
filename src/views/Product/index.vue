<template>
  <div>
    <HeaderNav />
    <table-page v-bind="tablePageOption" auto ref="page" />
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
import TablePage from '@/components/business/TablePage'
import { getProductList } from '@/api/product'

export default {
  components: {
    HeaderNav,
    TablePage,
  },
  data() {
    return {
      data: {},
    }
  },

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        // ({
        //   // token: JSON.parse(localStorage.getItem('token')),
        //   userId: sessionStorage.getItem('userId'),
        // }),
        // actions: [
        //   {
        //     name: '导出数据',
        //     type: 'primary',
        //     click: () => this.$refs.export.open(),
        //   },
        // ],
        table: {
          data: this.data.resultList,
        },
        pager: {
          total: this.data.totalCount,
        },
      }
    },
  },
  created() {
    this.loadData()
    // console.log(localStorage.getItem('token'))
    // getUser()
  },
  methods: {
    async loadData() {
      const res = await getProductList({
        styleNo: '',
        pageNum: '1',
        pageSize: '2',
      })
      // console.log(res)
      this.data = res.body
    },
  },

}
</script>

<style>

</style>
