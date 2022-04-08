<template>
  <div>
    <!-- 菜单管理 -->
    <div class="main container">
      <!-- <div>商品中心</div> -->
      <div class="table_height"> <TablePage v-bind="tablePageOption" auto /></div>
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getAllMenuList, delMenuById } from '@/api/menu'

export default {
  name: 'MenuList',
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
            name: '新增菜单',
            type: 'success',
            icon: 'el-icon-plus',
            click: this.addMenu,
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
                  path: '/system/menuList/AddMneu',
                  query: { item: scope },
                }),
              },
              {
                tip: '删除',
                type: 'primary',
                icon: 'el-icon-delete',
                click: this.deleteMenu,
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
      const res = await getAllMenuList({
        brandId: '1',
        ...params,
      })
      this.data = res.body
      // console.log(this.data)
    },
    // 新增菜单
    addMenu() {
      this.$router.push('/system/menuList/AddMneu')
    },
    // 删除菜单
    deleteMenu(item, index) {
      this.$confirm('确认删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // console.log(item)
        const con = {
          menuId: item.row.menuId,
        }
        delMenuById(con).then((res) => {
          // console.log("delMenuById==========",res.data.body);
          if (res.head.status === 0) {
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
            }
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          } else {
            this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        }).catch(() => {
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

<style>
.table_height {
  height: 500px;
}
</style>
