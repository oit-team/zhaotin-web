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
import { getCustomer } from '@/api/customer'

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
                click: this.deleteRole,
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
        pageSize: '2',
        code: '1',
      })
      console.log(res)
      this.data = res.body
    },
  },

}
</script>

<style lang="less" scoped>
/deep/ .el-table__body-wrapper {
    height: 600px;
}
</style>
