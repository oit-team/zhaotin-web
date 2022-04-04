<template>
  <div>
    <div class="main container">
      <!-- <div>商品中心</div> -->
      <TablePage :table="tablePageOption" />
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getProductList } from '@/api/product'

export default {
  name: 'Style',
  components: {
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
        data: this.data.resultList,
        // selectionItem: true,
        // selection: true,
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
      //   console.log(res.body)
      this.data = res.body
    },
  },

}
</script>

<style>

</style>
