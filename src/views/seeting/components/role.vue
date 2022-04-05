<template>
  <div>
    <div class="main container">
      <!-- <div>商品中心</div> -->
      <div class="h-96"> <TablePage v-bind="tablePageOption" /></div>
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getProductList } from '@/api/product'
import { reqRole } from '@/api/user'

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
        // ({
        //   // token: JSON.parse(localStorage.getItem('token')),
        //   userId: sessionStorage.getItem('userId'),
        // }),
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
            width: 130,
            buttons: [
              {
                tip: ({ row }) => ['发布', '撤回'][row.state],
                type: 'warning',
                icon: ({ row }) => ['el-icon-top-right'][row.state] || 'el-icon-bottom-left',
                click: this.handlePublish,
              },
              {
                tip: '编辑',
                type: 'primary',
                icon: 'el-icon-edit',
                click: ({ row }) => this.$router.push({
                  name: 'LiveStreamRoomUpdate',
                  params: { item: row },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.delLiveBroadcastRoom,
                option: {
                  type: 'delete',
                  fieldTip: '房间',
                  field: 'roomName',
                },
              },
            ],
          },
        },
        pager: {
          total: this.data.totalCount,
        },
      }
    },
  },
  created() {
    this.loadData()
    // console.log(localStorage.getItem('token'))
    // getUser()
  },
  methods: {
    async loadData() {
      const res = await reqRole({
        brandId: '1',
        pageNum: '1',
        pageSize: '15',
      })
      //   console.log(res.body)
      this.data = res.body
    },
    addRole() {
      this.$router.push('/system/addRole')
    },
  },

}
</script>

<style>

</style>
