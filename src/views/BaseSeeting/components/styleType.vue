<template>
  <div>
    <!-- <div class="main container"> -->
      <!-- <div>商品中心</div> -->
     <div> <TablePage v-bind="tablePageOption" ref="cateTable" auto>
            <template slot="content:imgUrl" slot-scope="{ row }">
            <!-- 商品图片 -->
            <template v-if="row.imgUrl" class="flex items-center">
            <div class="imgBox"><el-image class="w-full h-full" :src="row.imgUrl" fit="cover" @load="onImageLoad"/></div>
            </template>
          </template>
       </TablePage></div>
      <!-- 出口 -->
      <router-view />
    <!-- </div> -->
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { cateGoryList,delCateGory } from '@/api/category'

export default {
  name: 'Style',
  components: {
    TablePage,
  },
  data() {
    return {
      data: {},
      keyList:[] // 类别排序集合
    }
  },

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
         actions: [
          {
            name: '新增类别',
            type: 'success',
            icon: 'el-icon-plus',
            click: () => this.$router.push('/basls/styleType/addCateGory'),
          },
        ],
        table: {
          data: this.data.resultList,
           actions: {
            width: 180,
            buttons: [
              {
                tip: '编辑',
                type: 'success',
                icon: 'el-icon-edit',
                click: (scope) => this.$router.push({
                  path: '/basls/styleType/addCateGory',
                  query: { item: scope },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteCateGory,
              },
               {
                tip: '尺码配置',
                type: 'warning',
                icon: 'el-icon-s-data',
                click: (scope) => this.$router.push({
                  path: '/basls/styleType/sizeInfo',
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
  methods: {
    async loadData(params) {
      console.log(params);
      const con = {
         ...params,
       userId:sessionStorage.userId,
       type:'ACTEGORY'
      }
      await cateGoryList(con).then((res) => {
        if(res.head.status === 0) {
          this.data = res.body
          res.body.resultList.forEach(item => {
            this.keyList.push(item.dictitemOrderkey)
          })
          sessionStorage.setItem('keyList',this.keyList)
        }
      })
    },
    deleteCateGory(item) {
      this.$confirm('确订删除该商品类别吗？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning',
      }).then(() => {
        const con = {
          dictCode:'ACTEGORY',
          dictitemCode:item.row.dictitemCode
        }
        delCateGory(con).then((res) => {
          this.$refs.cateTable.loadData()
        })
      })
    },
    onImageLoad() {
      this.$refs.cateTable.doLayout()
    }
  },

}
</script>

<style lang="less" scoped>
/deep/ .el-table__body-wrapper {
    height: 600px;
}
.imgBox {
  width: 118px;
  height: 150px;
}
</style>
