<template>
  <div class="h-full my-10">
    <div style="height: 100%;">
      <div class="table-h" style="height: 100%;">
        <TablePage v-bind="tablePageOption" ref="page" class="!min-h-screen-sm" auto>
          <template #actions:upd>
            <el-dropdown class="ml-2">
              <el-button type="primary">
                上/下架<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleCommand(0)">
                  商品上架
                </el-dropdown-item>
                <el-dropdown-item @click.native="handleCommand(1)">
                  商品下架
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <!-- 商品图片 -->
          <!-- <template slot="content:resUrl" slot-scope="{ row }">
            <template v-if="row.resUrl">
              <el-image class="file-res" style="max-height:50px;" :src="row.resUrl" fit="cover" />
            </template>
            <template v-else>
              <span>无</span>
            </template>
          </template> -->
        </TablePage>
      </div>
    </div>

    <!-- 上架失败 -->
    <el-drawer
      ref="drawerUpd"
      title="上/下架日志信息"
      :visible.sync="drawerUpd"
      direction="rtl"
      wrapper-closable
    >
      <div v-for="item in errorList" :key="item.recordId" class="mb-4">
        <div v-html="item"></div>
        <el-divider />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { delIntegralGoods, getIntegralGoodsList, getTypeAndDate, updateIntegralGoodsState } from '@/api/integral'

export default {
  name: 'GoodsManage',
  data() {
    return {
      data: {},
      drawerVisible: true,
      ErrerInfoShow: false,
      importType: 1, // 导入类型  1 商品  2 商品库存
      importFlag: false, // 导入商品显示隐藏
      fileList: [], // 上传的文件列表

      exportModelFlag: false, // 导出商品
      checkList: [], // v-model绑定的数组
      exportInfoList: [], // 遍历的数组
      tempCheckList: [], // 默认全部选中，先把选项临时存储起来，方便赋值操作
      rowList: null, // 方法中用到的数据

      importErrDataFlag: false, // 导入显示
      addCount: null, // 导入错误数据
      upDateCount: null,
      failureCount: null,
      importErrData: null, // 导入失败数据列表
      errMessage: null,
      errorList: [],
      drawerUpd: false,

      formData: {
        pageNum: 1,
        pageSize: 20,
      },
      IntegralType: [],
    }
  },

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        search: {
          fieldProps: {
            goodsType: {
              // TODO 接口请求
              options: this.IntegralType,
            },
          },
        },
        actions: [
          {
            name: '新增商品',
            icon: 'el-icon-plus',
            type: 'success',
            click: () => this.$router.push({
              path: '/pointsManage/addIntegralGoods',
              query: {
                cite: false,
              },
            }),
          },
          {
            name: '商品引用',
            icon: 'el-icon-plus',
            type: 'success',
            click: () => this.$router.push({
              path: '/pointsManage/addIntegralGoods',
              query: {
                cite: true,
              },
            }),
          },
          {
            slot: 'upd',
          },
        ],
        table: {
          selection: true,
          data: this.data.integralGoodsList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '查看商品详情',
                type: 'primary',
                icon: 'el-icon-view',
                click: scope => this.$router.push({
                  path: '/pointsManage/addIntegralGoods',
                  query: {
                    item: scope,
                    flag: 1,
                    cite: scope.row.goodsSort === 2,
                    goodsSort: scope.row.goodsSort,
                  },
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteGoods,
                disabled: ({ row }) => {
                  if (row.state === 1) { // 1 是已上架
                    return true
                  } if (row.state === 2)
                    return false
                },
              },
              {
                tip: '编辑商品',
                type: 'success',
                icon: 'el-icon-edit',
                disabled: ({ row }) => {
                  if (row.state === 1) { // 1 是已上架
                    return true
                  } if (row.state === 2)
                    return false
                },
                click: scope => this.$router.push({
                  path: '/pointsManage/addIntegralGoods',
                  query: {
                    item: scope,
                    flag: 0,
                    cite: scope.row.goodsSort === 2,
                    goodsSort: scope.row.goodsSort, // 1积分商品 2引用商品
                  },
                }),
              },
            ],
          },
        },
        pager: {
          total: this.data.count,
        },
        selectionItem: true,
        selection: true,
      }
    },
  },
  created() {
    this.getType()
  },
  methods: {
    async loadData(params) {
      const res = await getIntegralGoodsList({
        ...params,
      })
      this.data = res.body
    },
    // 获取  商品类型列表
    getType() {
      getTypeAndDate({}).then(res => {
        if (res.head.status !== 0) this.$message(res.head.msg)
        res.body.goodsCategory.forEach((e) => {
          const data = {}
          data.optionValue = e.categoryName
          data.optionKey = e.orderKey
          this.IntegralType.push(data)
        })
      })
    },
    // 删除商品
    deleteGoods(item) {
      this.$confirm('确认删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const con = {
          id: item.row.id,
        }
        delIntegralGoods(con).then(res => {
          if (res.head.status !== 0) {
            this.$message(res.head.msg)
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.loadData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    // 获取选中项的值
    changeChecked(val) {
      // console.log("复选框变化后的值===",val);
      this.checkList = val
    },
    // 上架前判断该商品各个颜色是否都有图片和尺码
    checkstyleColor(row) {
      const returnRes = true
      if (row.styleColor === '') {
        this.$message({
          type: 'warning',
          message: '发布前请上传颜色',
        })
        return false
      }
      if (!returnRes) {
        this.$message({
          type: 'warning',
          message: '发布前请添加各颜色的商品图片、商品尺码',
        })
      }
      return returnRes
    },
    // 上架下架
    handleCommand(id) {
      const msg = id === 1 ? '下架' : '上架'
      const con = {
        id: [],
        state: id === 1 ? 2 : 1,
      }
      this.$confirm(`确认${msg}已选择的商品吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$refs.page.selected.forEach(e => {
          con.id.push(e.id)
        })
        updateIntegralGoodsState(con).then((res) => {
          if (res.head.status !== 0) this.$message(res.head.msg)
          else this.$message.success('操作成功')
          this.errorList = [...res.body.errorList]
          // 如果有失败的数据  则弹出--抽屉
          if (res.body.errorList.length !== 0) this.drawerUpd = true
        })
        this.$refs.page.loadData()
      }).catch(() => {
        this.$message({
          message: '已取消',
        })
      })
    },
  },

}
</script>

<style lang="less" scoped>
  .table-h {
    height: 680px;
  }
  .table-page{
    min-height: 600px;
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
  ::v-deep .el-loading-spinner{
    left: 50%;
  }
  ::v-deep .el-drawer__body{
    padding: 20px;
  }
  .ErrorInfo{
    padding:0 20px;
  }
</style>
