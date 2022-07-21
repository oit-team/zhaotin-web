<template>
  <div class="h-full my-10">
    <div class="main container">
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
      return {
        promise: this.loadData,
        // 搜索表单内的按钮
        actions: [
          // {
          //   name: '新增角色',
          //   type: 'success',
          //   icon: 'el-icon-plus',
          //   click: this.addRole,
          // },
        ],
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '订单详情',
                type: 'success',
                icon: 'el-icon-view',
                click: scope => this.$router.push({
                  path: '/pointsManage/orderInfo',
                  query: { item: scope, flag: 0 },
                }),
              },
              {
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
              },
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: scope => this.$router.push({
                  path: '/pointsManage/orderInfo',
                  query: { item: scope, flag: 1 },
                }),
              },
            ],
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
  height: 600px;
}

::v-deep .el-loading-spinner {
  left: 50%;
}
</style>
