<template>
  <div style="height: 100%;">
    <div style="height: 100%;">
      <TablePage v-bind="tablePageOption" ref="cateTable" auto>
        <template slot="content:isStyleRecommended" slot-scope="{ row }">
          <template v-if="row.isStyleRecommended == 0">
            <span>否</span>
          </template>
          <template v-else-if="row.isStyleRecommended == 1">
            <span>是</span>
          </template>
        </template>
      </TablePage>
    </div>
      <!-- 出口 -->
    <router-view />
    <!-- </div> -->
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getSeason, delSeason } from '@/api/goods'

export default {
  name: 'Style',
  components: {
    TablePage,
  },
  data() {
    return {
      data: {},
      keyList:[] // 类别排序集合
    }
  },

  computed: {
    tablePageOption() {
      let operation = JSON.parse(this.$store.state.menu.menuOperation)
      let actions = [];
      let buttons = [];
      operation.forEach((item,index) => {
        // if (item.statue == 1) {
        if (true) {
          if (item.operationKey == 'update') {
            buttons.push({
              tip: '编辑',
              type: 'success',
              icon: 'el-icon-edit',
              click: (scope) => this.$router.push({
                path: '/basls/season/addSeason',
                query: { item: scope },
              })
            })
          } else if (item.operationKey == 'delete') {
            buttons.push({
              tip: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              click: this.deleteSeason,
            })
          } else if (item.operationKey == 'insert') {
            actions.push({
              name: '新增季节',
              type: 'success',
              icon: 'el-icon-plus',
              click: () => this.$router.push('/basls/season/addSeason'),
            })
          }
        }
      })
      return {
        promise: this.loadData,
        actions,
        table: {
          data: this.data.resultList,
           actions: {
            width: 180,
            buttons,
          },
        },
        pager: {
          total: this.data.count,
        },
      }
    },
  },
  methods: {
    async loadData(params) {
      let operation = JSON.parse(this.$store.state.menu.menuOperation)
      let selectOperation = ""
      operation.forEach(item => {
        if (item.operationKey == "selectAll" && item.statue == 1) {
          selectOperation = "selectAll"
        }
      })
      const con = {
         ...params,
         selectOperation,
      }
      await getSeason(con).then((res) => {
        if(res.head.status === 0) {
          this.data = res.body
        }
      })
    },
    deleteSeason(item) {
      this.$confirm('确订删除该季节吗？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消', 
        type:'warning',
      }).then(() => {
        const con = {
          id: item.row.id
        }
        delSeason(con).then((res) => {
          this.$refs.cateTable.loadData()
        })
      })
    },
    onImageLoad() {
      this.$refs.cateTable.doLayout()
    }
  },
}
</script>

<style lang="less" scoped>
  .table-h {
    height: 600px;
  }
  /deep/ .el-table__body-wrapper {
    overflow: auto!important;
    overflow-y: scroll!important;
  }
  /deep/ .gutter {
    width: 22px !important;
    display: inline-block !important;
  }
  /deep/ .el-table__fixed-right-patch {
    width: 22px !important;
  }
  /deep/ .el-table__fixed-right {
    top: 0;
    left: auto;
    right: 18px;
  }

</style>
