<template>
  <div class="h-full my-10">
    <div class="h-full">
      <div class="table_height">
        <TablePage v-bind="tablePageOption" ref="page" auto />
      </div>
    </div>
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getOrderList } from '@/api/order'

export default {
  name: 'GoodsOrder',
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
      const operation = JSON.parse(this.$store.state.menu.menuOperation)
      const buttons = []
      const actions = []
      operation.forEach((item) => {
        if (item.statue === 1) {
          if (item.operationKey === 'selectById') {
            buttons.push({
              tip: '订单详情',
              type: 'success',
              icon: 'el-icon-view',
              click: scope => this.$router.push({
                path: '/pointsManage/orderInfo',
                query: { item: scope },
              }),
            })
          } else if (item.operationKey === 'update') {
            buttons.push({
              tip: '编辑',
              type: 'warning',
              icon: 'el-icon-edit',
              click: scope => this.$router.push({
                path: '/pointsManage/orderInfo',
                query: { item: scope, flag: 1 },
              }),
            })
          } else if (item.operationKey === 'delete') {
            buttons.push({
              tip: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              click: () => {},
              disabled: ({ row }) => {
                if (row.status === '1') { // 1 是已上架
                  return true
                } if (row.status === '0')
                  return false
              },
            })
          } else if (item.operationKey === 'insert') {
            actions.push({
              name: '新增订单',
              type: 'success',
              icon: 'el-icon-plus',
              // click: () => this.$router.push('/basls/customerAccount/addCustomer'),
            })
          }
        }
      })
      return {
        promise: this.loadData,
        // 搜索表单内的按钮
        actions: [],
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
  created() {
  },
  methods: {
    async loadData(params) {
      const con = {
        userId: sessionStorage.getItem('userId'),
        ...params,
      }
      await getOrderList(con).then((res) => {
        if (res.head.status === 0)
          this.data = res.body
      }).catch(() => {

      })
    },
  },

}
</script>

<style lang="less" scoped>
.table_height {
  height: 100%;
}

::v-deep .el-loading-spinner {
  left: 50%;
}
</style>
