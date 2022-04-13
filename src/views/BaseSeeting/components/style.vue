<template>
  <div>
    <div class="main container">
      <!-- <div>商品中心</div> -->
      <div class="table-h">
        <TablePage v-bind="tablePageOption" auto ref="page">
          <!-- <el-drawer :visible.sync="drawerVisible" size="40%"> -->
          <template slot="content:resUrl" slot-scope="{ row }">
            <!-- 商品图片 -->
            <template v-if="true">
              <el-image class="file-res" :src="row.resUrl" fit="cover" />
            </template>
            <!-- 商品视频 -->
            <!-- <template v-if="row.resType === FILE_TYPE.VIDEO">
              <el-image class="file-res" :src="row.videoImg" fit="cover" />
            </template> -->
          </template>
          <!-- </el-drawer> -->
        </TablePage>
      </div>
      <!-- 出口 -->
      <router-view />
    </div>
    <!-- 导入导出操作 -->

    <!-- 导入商品 -->
    <el-drawer
      :title="importType==1?'导入商品':'导入商品库存'"
      :visible.sync="importFlag"
      direction="rtl"
      size="30%"
      :before-close="handleImportClose"
    >
      <div class="text-center">
        <el-upload
          class="upload-demo"
          style="margin:30px 0px;"
          ref="upload"
          :limit="1"
          action="#"
          accept=".xlsx,.xls"
          :http-request="uploadFile"
          :on-change="changeFile"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :auto-upload="false"
        >
          <template #trigger>
            <el-button size="small" type="primary">选取文件</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip mt-4">
              只能上传 .xlsx/.xls 文件，且不超过 1000kb
            </div>
          </template>
        </el-upload>
        <div style="margin-top: 20px">
          <el-button v-if="importType==1" size="small" type="success" @click="confirmImportGoods">导入商品</el-button>
          <el-button v-if="importType==2" size="small" type="success" @click="confirmImportStock">导入库存</el-button>
          <el-button size="small" @click="cancelImport = false">取消导入</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 导出商品 -->
    <el-drawer
      title="请选择需要导出的字段"
      :visible.sync="exportModelFlag"
      :wrapper-closable="false"
      direction="rtl"
      size="40%"
    >
      <div class="">
        <el-checkbox-group v-model="checkList" @change="changeChecked">
          <div
            style="text-align:left;margin:6px 0px;"
            v-for="(item,index) in exportInfoList"
            :key="index"
          >
            <el-checkbox
              :label="item.columnName"
              true-label
            >
              {{ item.columnDesc }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
        <div style="margin-top: 20px">
          <el-button size="small" @click="cancelExportGoods">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmExportGoods">确 认</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 导入excel时错误数据的展示 -->
    <el-drawer
      title="导入错误数据展示"
      :visible.sync="importErrDataFlag"
      direction="rtl"
      size="40%"
      :before-close="handleImportErrClose"
    >
      <div class="">
        <h3>{{ addCount }}</h3>
        <h3>{{ upDateCount }}</h3>
        <h3>{{ failureCount }}</h3>
        <h3>失败数据如下:</h3>
        <ul class="errDataBox" style="text-align:left;">
          <li
            class="errDataItem"
            style="line-height:30px;"
            v-for="(item,index) in importErrData"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
        <div style="margin-top: 20px">
          <el-button size="small" @click="cancelErrData">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getProductList } from '@/api/product'
import { getDeleteStyleInfo, getExportInfo } from '@/api/goods'

export default {
  name: 'Style',
  components: {
    TablePage,
  },
  data() {
    return {
      data: {},
      drawerVisible: true,

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
            name: '新增商品',
            icon: 'el-icon-plus',
            type: 'success',
            click: () => this.addGoods(),
          },
          {
            name: '导入商品',
            icon: 'el-icon-download',
            // style:style="background:#4FD5AC;border-color: #4FD5AC;color:#fff;"
            type: 'primary',
            click: () => this.importGoods(),
          },
          {
            name: '导出商品',
            icon: 'el-icon-upload2',
            type: 'primary',
            click: () => this.export(),
          },
          {
            name: '导入库存',
            icon: 'el-icon-download',
            type: 'primary',
            click: () => this.$refs.export.open(),
          },
        ],
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: '查看商品详情',
                type: 'primary',
                icon: 'el-icon-view',
                click: (scope) => this.$router.push({
                  path: '/basls/style/addGoods',
                  query: { item: scope },
                }),
              },
              {
                tip: '删除',
                type: 'primary',
                icon: 'el-icon-delete',
                click: this.deleteGoods,
              },
              {
                tip: '商品上架',
                type: 'danger',
                icon: 'el-icon-top',
                click: ({ row }) => this.$router.push({
                  // path: '/system/addRole',
                  params: { item: row },
                }),
              },
              {
                tip: '库存分布',
                // type: 'danger',
                icon: 'el-icon-s-data',
                click: ({ row }) => this.$router.push({
                  // path: '/system/addRole',
                  params: { item: row },
                }),
              },
            ],
          },
        },
        pager: {
          total: this.data.totalCount,
        },
        selectionItem: true,
        selection: true,
      }
    },
  },
  created() {

  },
  methods: {
    addGoods() {
      this.$router.push('/basls/style/addGoods')
    },
    async loadData(params) {
      const res = await getProductList({
        brandId: '1',
        ...params,
      })
      // console.log(res)
      this.data = res.body
    },
    // 查询导出商品字段
    getExportInfo() {
      this.tempCheckList = []
      const con = {
        type: sessionStorage.menuCode,
        code: 'goods',
      }
      getExportInfo(con).then((res) => {
        console.log(res)
        if (res.data.head.status === 0) {
          this.exportInfoList = res.data.body.exportTitle
          for (let i = 0; i < this.exportInfoList.length; i++) {
            this.tempCheckList.push(this.exportInfoList[i].columnName)
          }
          this.checkList = this.tempCheckList
          // console.log("默认全选===",this.checkList)
        } else {
          this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除商品
    deleteGoods(item) {
      this.$confirm('确认删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        console.log(item)
        const con = {
          styleId: item.row.styleId.toString(),
        }
        getDeleteStyleInfo(con).then((res) => {
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
    // 导入商品
    importGoods() {
      this.importFlag = true
    },
    // 监控上传文件列表
    changeFile(file, fileList) {
      const existFile = fileList.slice(0, fileList.length - 1).find((f) => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.fileList = fileList
      // console.log("this.fileList===",this.fileList)
    },
    // 限制每次只能上传一个文件
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // // 上传文件
    uploadFile(file) {
      this.fileData.append('file', file.file)
      // console.log("this.fileData====",this.fileData)
    },
    // 取消导入
    cancelImport() {
      // this.importFlag = false
    },
    // 导出商品
    export() {
      this.exportModelFlag = true
      this.getExportInfo()
    },
  },

}
</script>

<style>
.table-h {
  height: 600px;
}
</style>
