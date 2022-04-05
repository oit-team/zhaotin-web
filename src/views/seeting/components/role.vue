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
            width: 180,
            buttons: [
              {
                tip: '编辑',
                type: 'warning',
                icon: 'el-icon-edit',
                click: (scope) => this.$router.push({
                  // name: 'addRole',
                  path: '/system/addRole',
                  query: { item: scope },
                }),
              },
              {
                tip: '删除',
                type: 'primary',
                icon: 'el-icon-delete',
                click: ({ row }) => this.$router.push({
                  // name: 'LiveStreamRoomUpdate',
                  path: '/system/addRole',
                  params: { item: row },
                }),
              },
              {
                tip: '授权',
                type: 'danger',
                icon: 'el-icon-thumb',
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
