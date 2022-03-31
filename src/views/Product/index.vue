<template>
  <div>
    <HeaderNav />
    <h3>首页</h3>
    <!-- <table-page v-bind="tablePageOption" auto ref="page" /> -->
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

  computed: {
    tablePageOption() {
      return {
        // promise: this.loadData({
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
          // data: this.data.resultList,
        },
        pager: {
          // total: this.data.totalCount,
        },
      }
    },
  },
  created() {
    // getProductList({
    //   styleNo: '',
    //   pageNum: '1',
    //   pageSize: '2',
    //   userId: '1',
    // })
    // console.log(localStorage.getItem('token'))
    // getUser()
  },
  methods: {
    // async loadData(con) {
    //   const res = await getTreeMenuList(con)
    //   this.data = res.body
    //   // console.log(this.data.resultList)
    // },

  },

}
</script>

<style>

</style>
