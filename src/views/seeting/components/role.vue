<template>
  <div>
      <!-- <div>商品中心</div> -->
      <div><TablePage v-bind="tablePageOption" auto /></div>
      <!-- 出口 -->
      <router-view />
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { reqRole, deleteRole } from '@/api/user'

export default {
  name: 'Role',
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
          {
            name: '新增角色',
            type: 'success',
            icon: 'el-icon-plus',
            click: this.addRole,
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
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteRole,
              },
              {
                tip: '授权',
                type: 'success',
                icon: 'el-icon-thumb',
                click: (scope) => this.$router.push({
                  path: '/system/authUsersByRoleId',
                  query: { item: scope },
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
      // console.log(params)
      const res = await reqRole({
        brandId: '1',
        ...params,
      })
      this.data = res.body
      // console.log(this.data)
    },
    // 新增角色
    addRole() {
      this.$router.push('/system/addRole')
    },
    // 删除角色
    deleteRole(item, index) {
      this.$confirm('确认删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // const _this = this
        const con = {
          roleId: item.row.roleId,
          userId: sessionStorage.userId,
          pageNum: index,
        }
        deleteRole(con).then((res) => {
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
