<template>
  <div style="height: 100%;">
    <div class="main container" style="height: 100%;">
      <div class="table-h" style="height: 100%;"> 
        <TablePage v-bind="tablePageOption" ref="cateTable" auto>
          <template slot="content:imgUrl" slot-scope="{ row }">
            <template v-if="true">
              <el-image class="file-res" style="max-height:50px;" :src="row.imgUrl" fit="cover" />
            </template>
          </template>
        </TablePage>
      </div>
    </div>
      <!-- 出口 -->
    <router-view />
    <!-- </div> -->
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { catediRGoryList,delDirCateGory } from '@/api/category'

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
            name: '新增词典',
            type: 'success',
            icon: 'el-icon-plus',
            click: () => this.$router.push('/basls/otherCategoryList/addDictionaryType'),
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
                  path: '/basls/otherCategoryList/addDictionaryType',
                  query: { item: scope },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteCateGory,
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
      const con = {
         ...params,
       userId:sessionStorage.userId,
       type:''
      }
      await catediRGoryList(con).then((res) => {
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
          dictCode: item.row.dictCode,
          dictitemCode:item.row.dictitemCode
        }
        delDirCateGory(con).then((res) => {
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
  .table-h {
    height: 600px;
  }
  /deep/ .el-table__body-wrapper {
    overflow: auto!important;
    overflow-y: scroll!important;
  }
  /deep/ .gutter {
    width: 22px !important;
    display: inline-block !important;
  }
  /deep/ .el-table__fixed-right-patch {
    width: 22px !important;
  }
  /deep/ .el-table__fixed-right {
    top: 0;
    left: auto;
    right: 18px;
  }
  /deep/ .el-image__inner{
    height: 50px;
    width: auto;
  }
</style>
