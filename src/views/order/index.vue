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
                type: 'primary',
                icon: 'el-icon-delete',
                click: this.deleteRole,
              },
              {
                tip: '授权',
                type: 'danger',
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
      const con = {
        userId: sessionStorage.userId,
        ...params,
      }
      await orderInfo(con).then((res) => {
        if (res.head.status === 0) {
          this.data = res.body
        }
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
