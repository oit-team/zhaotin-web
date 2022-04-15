<template>
  <div>
    <div class="main container">
      <div class="tablel-h">
        <TablePage v-bind="tablePageOption" auto />
      </div>
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getCustomer, delUserById } from '@/api/customer'

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
        actions: [
          {
            name: '新增客户',
            type: 'success',
            icon: 'el-icon-plus',
            click: () => this.$router.push('/basls/customerAccount/addCustomer'),
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
                  path: '/basls/customerAccount/addCustomer',
                  query: { item: scope },
                }),
              },
              {
                tip: '删除',
                type: 'primary',
                icon: 'el-icon-delete',
                click: this.deleteCustomer,
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
    // this.loadData()
    // console.log(localStorage.getItem('token'))
    // getUser()
  },
  methods: {
    async loadData() {
      const res = await getCustomer({
        pageNum: '1',
        pageSize: '999',
        code: '1',
      })
      // console.log(res)
      this.data = res.body
    },
    // 删除角色
    deleteCustomer(item) {
      this.$confirm('确认删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // console.log(item.row.id.toString())
        const con = {
          id: item.row.id.toString(),
          userId: sessionStorage.userId,
          code: '1',
        }
        delUserById(con).then((res) => {
          // console.log(res)
          // this.loadData()
          if (res.head.status === 0) {
            // 删除列表中点击删除的数据，item是被点击行的信息
            this.data.resultList.splice(item.$index, 1)
            if (this.total > 0) {
              this.total -= 1
            }
            if (this.data.resultList.length === 0 && this.total > 0) {
              this.pageNum -= 1
              this.dynamicParam.forEach(el => {
                if (el.key === 'pageNum') {
                  el.value = this.pageNum
                }
              })
              // this.$refs.child.parentMsgs(this.dynamicParam)
            }
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          } else {
            this.$message({
              message: res.head.msg,
              type: 'warning',
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
  },

}
</script>

<style lang="less" scoped>
/deep/ .el-table__body-wrapper {
    height: 600px;
}
</style>
