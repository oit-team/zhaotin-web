<template>
  <div>
    <div class="main container">
      <!-- <div>商品中心</div> -->
      <div class="h-96">
        <TablePage v-bind="tablePageOption" auto>
          <template slot="content:describe" slot-scope="{ row }">
            <el-tag
              v-if="row.defaults === DEFAULT_STATE.YES"
              class="mr-1"
              size="small"
              type="primary"
            >
              默认
            </el-tag>
            <span>{{ row.describe }}</span>
          </template>
          <template slot="content:stateName" slot-scope="{ row }">
            <span
              :class="['text-red-400', 'text-green-400'][row.state]"
            >{{ row.stateName }}</span>
          </template>
        </TablePage>
      </div>
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
        actions: [
          {
            name: '导出数据',
            type: 'primary',
            click: () => this.$refs.export.open(),
          },
        ],
        table: {
          data: this.data.resultList,
        },
        pager: {
          total: this.data.totalCount,
        },
        // selectionItem: true,
        // selection: true,
      }
    },
  },
  created() {
    // this.loadData()
    // console.log(localStorage.getItem('token'))
    // getUser()
  },
  methods: {
    // async loadData() {
    //   const res = await getProductList({
    //     styleNo: '',
    //     pageNum: '1',
    //     pageSize: '2',
    //   })
    //   //   console.log(res.body)
    //   this.data = res.body
    // },
    loadData() {
      return getProductList({
        styleNo: '',
        pageNum: '1',
        pageSize: '2',
      }).then(res => {
        this.data = res.body
      })
    },
  },

}
</script>

<style>

</style>
