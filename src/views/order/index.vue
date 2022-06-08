<template>
  <div>
    <HeaderNav class="mb-4" />
    <div class="main container">
      <div class="table_height">
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
import { orderInfo } from '@/api/order'

export default {
  name: 'Role',
  components: {
    TablePage,
    HeaderNav,
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
      operation.forEach((item, index) => {
        if (item.statue === 1) {
          if (item.operationKey === 'selectById') {
            buttons.push({
              tip: '订单详情',
              type: 'success',
              icon: 'el-icon-view',
              click: (scope) => this.$router.push({
                path: '/order/orderMsg',
                query: { item: scope },
              }),
            })
          } else if (item.operationKey === 'update') {
            buttons.push({
              tip: '编辑',
              type: 'warning',
              icon: 'el-icon-edit',
              click: (scope) => this.$router.push({
                path: '/order/orderMsg',
                query: { item: scope },
              }),
            })
          } else if (item.operationKey === 'delete') {
            buttons.push({
              tip: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              click: () => {},
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
  created() {
  },
  methods: {
    async loadData(params) {
      const operation = JSON.parse(this.$store.state.menu.menuOperation)
      let selectOperation = ''
      operation.forEach(item => {
        if (item.operationKey === 'selectAll' && item.statue === 1) {
          selectOperation = 'selectAll'
        }
      })
      const con = {
        userId: sessionStorage.userId,
        ...params,
        selectOperation,
      }
      await orderInfo(con).then((res) => {
        if (res.head.status === 0) {
          this.data = res.body
        }
      }).catch(() => {

      })
    },
  },

}
</script>

<style lang="less" scoped>
.table_height {
  height: 680px;
}
</style>
