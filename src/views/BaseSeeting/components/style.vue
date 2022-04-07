<template>
  <div>
    <div class="main container">
      <!-- <div>商品中心</div> -->
      <div class="table_height">
        <TablePage v-bind="tablePageOption" auto ref="page">
          <!-- <el-drawer :visible.sync="drawerVisible" size="40%"> -->
          <template slot="content:resUrl" slot-scope="{ row }">
            <!-- 商品图片 -->
            <template v-if="true">
              <el-image class="file-res" :src="row.resUrl" fit="cover" />
            </template>
            <!-- 商品视频 -->
            <!-- <template v-if="row.resType === FILE_TYPE.VIDEO">
              <el-image class="file-res" :src="row.videoImg" fit="cover" />
            </template> -->
          </template>
          <!-- </el-drawer> -->
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
      drawerVisible: true,
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
            name: '新增商品',
            icon: 'el-icon-plus',
            type: 'success',
            click: () => this.addGoods(),
          },
          {
            name: '导入商品',
            icon: 'el-icon-download',
            // style:style="background:#4FD5AC;border-color: #4FD5AC;color:#fff;"
            type: 'primary',
            click: () => this.$refs.export.open(),
          },
          {
            name: '导出商品',
            icon: 'el-icon-upload2',
            type: 'primary',
            click: () => this.$refs.export.open(),
          },
          {
            name: '导入库存',
            icon: 'el-icon-download',
            type: 'primary',
            click: () => this.$refs.export.open(),
          },
        ],
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: (scope) => this.$router.push({
                  path: '/system/addRole',
                  query: { item: scope },
                }),
              },
              {
                tip: '删除',
                type: 'primary',
                icon: 'el-icon-delete',
                click: this.deleteRole,
              },
              {
                tip: '授权',
                type: 'danger',
                icon: 'el-icon-thumb',
                click: ({ row }) => this.$router.push({
                  // path: '/system/addRole',
                  params: { item: row },
                }),
              },
            ],
          },
        },
        pager: {
          total: this.data.totalCount,
        },
        selectionItem: true,
        selection: true,
      }
    },
  },
  created() {

  },
  methods: {
    addGoods() {
      this.$router.push('/basls/style/addGoods')
    },
    async loadData(params) {
      const res = await getProductList({
        brandId: '1',
        ...params,
      })
      this.data = res.body
    },
  },

}
</script>

<style>
.table_height {
  height: 500px;
}
</style>
