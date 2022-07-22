<template>
  <div style="height: 100%;">
    <div class="main container" style="height: 100%;">
      <!-- <div>商品中心</div> -->
      <div class="table-h">
        <TablePage v-bind="tablePageOption" ref="page" auto />
      </div>
    </div>
    <!-- 导入导出操作 -->

    <!-- 导入商品 -->
    <el-drawer
      :title="importType === 1 ? '导入商品' : '导入商品库存'"
      :visible.sync="importFlag"
      direction="rtl"
      size="40%"
      :before-close="handleImportClose"
    >
      <div v-show="!ErrerInfoShow" class="text-center">
        <el-upload
          ref="upload"
          class="upload-demo"
          style="margin:30px 0px;"
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
            <el-button size="small" type="primary">
              选取文件
            </el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip mt-4">
              只能上传 .xlsx/.xls 文件，且不超过 1000kb
            </div>
          </template>
        </el-upload>
        <div style="margin-top: 20px">
          <el-button v-if="importType === 1" size="small" type="success" @click="confirmImportGoods">
            导入商品
          </el-button>
          <el-button v-if="importType === 2" size="small" type="success" @click="confirmImportStock">
            导入库存
          </el-button>
          <el-button size="small" @click="importGoodsClose">
            取消导入
          </el-button>
        </div>
      </div>
      <div v-show="ErrerInfoShow" class="ErrorInfo">
        <h3>{{ addCount }}</h3>
        <h3>{{ upDateCount }}</h3>
        <h3>{{ failureCount }}</h3>
        <h3>失败数据如下:</h3>
        <p>{{ errMessage }}</p>
        <ul class="errDataBox" style="text-align:left;">
          <li
            v-for="(item, index) in importErrData"
            :key="index"
            class="errDataItem"
            style="line-height:30px;"
          >
            {{ item }}
          </li>
        </ul>
        <div style="margin-top: 20px">
          <el-button size="small" @click="importGoodsClose">
            取消
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 导出商品 -->
    <el-drawer
      title="请选择需要导出的字段"
      :visible.sync="exportModelFlag"
      :wrapper-closable="true"
      direction="rtl"
      size="40%"
      :before-close="handleExportClose"
    >
      <div class="text-center">
        <el-checkbox-group v-model="checkList" @change="changeChecked">
          <div
            v-for="(item, index) in exportInfoList"
            :key="index"
            style="text-align:left;margin:6px 0px;"
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
          <el-button size="small" @click="exportModelFlag = false">
            取 消
          </el-button>
          <el-button size="small" type="primary" @click="confirmExportGoods">
            确 认
          </el-button>
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
        <p>{{ errMessage }}</p>
        <ul class="errDataBox" style="text-align:left;">
          <li
            v-for="(item, index) in importErrData"
            :key="index"
            class="errDataItem"
            style="line-height:30px;"
          >
            {{ item }}
          </li>
        </ul>
        <div style="margin-top: 20px">
          <el-button size="small" @click="importErrDataFlag = false">
            取消
          </el-button>
        </div>
      </div>
    </el-drawer>

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
import axios from 'axios'
import TablePage from '@/components/business/TablePage'
import { getIntegralGoodsList } from '@/api/integral'
// import { getDeleteStyleInfo, getExportInfo, getExportStyleInfo, , updateStyleStatusById } from '@/api/goods'

export default {
  name: 'PointsManage',
  components: {
    TablePage,
  },
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
    }
  },

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        pager: {
          total: this.data.totalCount,
        },
        selectionItem: true,
        selection: true,
      }
    },
  },
  created() {
    this.loadData()
  },
  activated() {
  },
  methods: {
    addGoods() {
      // this.$router.push('/basls/style/addGoods')
    },
    async loadData(params) {
      const res = await getIntegralGoodsList({
        ...params,
      })
      this.data = res.body
    },
    // loadData() {
    //   console.log(342)
    //   getIntegralGoodsList(this.formData).then(res => {
    //     console.log(res)
    //   })
    // },
    // 查询导出商品字段
    getExportInfo() {
      this.tempCheckList = []
      const con = {
        type: 'styleList',
        code: 'style',
      }
      // getExportInfo(con).then((res) => {
      //   if (res.head.status === 0) {
      //     this.exportInfoList = res.body.exportTitle
      //     for (let i = 0; i < this.exportInfoList.length; i++) {
      //       this.tempCheckList.push(this.exportInfoList[i].columnName)
      //     }
      //     this.checkList = this.tempCheckList
      //     // console.log("默认全选===",this.checkList)
      //   } else {
      //     this.$message({
      //       message: res.head.msg,
      //       type: 'warning',
      //     })
      //   }
      // }).catch(err => {
      //   // console.log(err)
      // })
    },
    // 删除商品
    deleteGoods(item) {
      this.$confirm('确认删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // console.log(item)
        const con = {
          styleId: item.row.styleId.toString(),
        }
        // getDeleteStyleInfo(con).then((res) => {
        //   // console.log("delMenuById==========",res.data.body);
        //   if (res.head.status === 0) {
        //     this.data.resultList.splice(item.$index, 1)
        //     if (this.total > 0) {
        //       this.total -= 1
        //     }
        //     if (this.data.resultList.length === 0 && this.total > 0) {
        //       this.pageNum -= 1
        //       this.dynamicParam.forEach(el => {
        //         if (el.key === 'pageNum') {
        //           el.value = this.pageNum
        //         }
        //       })
        //     }
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!',
        //     })
        //   } else {
        //     this.$message({
        //       message: res.data.head.msg,
        //       type: 'warning',
        //     })
        //   }
        // }).catch(() => {
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    // 导入商品
    importGoods() {
      this.importType = 1
      this.importFlag = true
    },
    // 点击导入库存按钮
    importStock() {
      this.importType = 2
      this.importFlag = true
    },
    // 确认导入库存
    confirmImportStock() {
      if (this.fileList.length === 0) {
        this.$message({
          message: '请先选择文件',
          type: 'warning',
        })
      } else {
        this.$message({
          type: 'warning',
          message: '正在导入中，请稍候',
        })
        const formData = new FormData() //  用FormData存放上传文件
        // console.log("this.fileList====",this.fileList)
        formData.append('file', this.fileList[0].raw)
        formData.append('brandId', sessionStorage.brandId)

        // console.log("formData====",formData)
        // 向webapi发起请求，等待后台接收
        const _this = this
        axios.post(`${_this.GLOBAL.data_manager_server}/dataStockInfo/importStockInfo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res) => {
          _this.importFlag = false
          // console.log("-----------------",res.data);
          _this.$refs.upload.clearFiles()
          if (res.data.head.status === 0) {
            // console.log("导入库存成功",res.data.body)
            _this.importResult = res.data.body
            _this.addCount = res.data.body.addCount
            _this.upDateCount = res.data.body.upDateCount
            _this.failureCount = res.data.body.failureCount

            _this.fileList = []
            _this.fileData = ''

            if (res.data.body.errorStr && res.data.body.errorStr.length > 0) {
              _this.importErrDataFlag = true
              _this.importErrData = res.data.body.errorStr
            } else {
              this.$alert(`导入完成,${res.data.body.addCount},${res.data.body.upDateCount},${res.data.body.failureCount}`, '提示', {
                confirmButtonText: '确定',
                callback: () => {},
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: res.data.head.msg,
            })
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '导入商品失败',
          })
        })
      }
    },
    importGoodsClose() {
      this.addCount = null
      this.upDateCount = null
      this.failureCount = null
      this.errMessage = null
      this.importErrData = null
      this.$refs.upload.clearFiles()
      this.ErrerInfoShow = false
      this.importFlag = false
    },
    handleImportClose() {
      this.$confirm('确认关闭？').then(() => {
        this.importGoodsClose()
      }).catch(() => {})
    },
    handleExportClose() {
      this.$confirm('确认关闭？').then(() => {
        this.exportModelFlag = false
      }).catch(() => {})
    },
    // 监控上传文件列表
    changeFile(file, fileList) {
      const existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
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
    // 上传文件
    uploadFile(file) {
      this.fileData.append('file', file.file)
      // console.log("this.fileData====",this.fileData)
    },
    // 确认导入商品
    confirmImportGoods() {
      // this.$refs.upload.submit();
      if (this.fileList.length === 0) {
        this.$message({
          message: '请先选择文件',
          type: 'warning',
        })
      } else {
        this.$message({
          type: 'warning',
          message: '正在导入中，请稍候',
          duration: '1000',
        })
        const _this = this
        const formData = new FormData() //  用FormData存放上传文件
        // console.log("this.fileList====",this.fileList)
        formData.append('file', this.fileList[0].raw)
        formData.append('brandId', sessionStorage.brandId)
        formData.append('code', '2')
        formData.append('userId', sessionStorage.userId)
        const BASE_URL = process.env.VUE_APP_BASE_URL
        axios({
          url: `${BASE_URL}/goods/style/addimporStyleInfo`,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': sessionStorage.accessToken,
          },
          data: formData,
        }).then((res) => {
          if (res.status === 200 && res.data.head.status === 0) {
            this.importResult = res.data.body
            this.addCount = res.data.body.addCount
            this.upDateCount = res.data.body.upDateCount
            this.failureCount = res.data.body.failureCount
            this.fileList = []
            this.fileData = ''
            this.$refs.page.loadData()
            if (res.data.body.errorStr && res.data.body.errorStr.length > 0) {
              this.ErrerInfoShow = true
              this.importErrData = res.data.body.errorStr
            } else {
              this.$alert(`导入完成,${res.data.body.addCount},${res.data.body.upDateCount},${res.data.body.failureCount}`, '提示', {
                confirmButtonText: '确定',
                callback: (action) => {
                  this.importGoodsClose()
                },
              })
            }
          } else {
            this.ErrerInfoShow = true
            this.errMessage = res.data.head.msg
            this.$message({
              type: 'error',
              message: '导入商品失败',
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '导入商品失败',
          })
        })
      }
    },
    // 导入错误数据的关闭操作
    handleImportErrClose() {
      this.$confirm('确认关闭？').then(() => {
        this.importErrDataFlag = false
      }).catch(() => {})
    },
    // 点击打开导出商品弹框
    export() {
      this.exportModelFlag = true
      this.getExportInfo()
    },
    // 获取选中项的值
    changeChecked(val) {
      // console.log("复选框变化后的值===",val);
      this.checkList = val
    },
    // 确认导出商品按钮
    confirmExportGoods() {
      this.rowList = {}
      // if (this.checkList.length > 0) {
      //   for (let i=0;i<this.checkList.length;i++) {
      //     for (let j=0;j<this.exportInfoList.length;j++) {
      //       if(this.checkList[i]==this.exportInfoList[j].columnName){
      //         this.rowList[this.exportInfoList[j].columnName] = this.exportInfoList[j].columnDesc;
      //       }
      //     }
      //   }
      // }
      if (Object.keys(this.rowList).length > 0) {
        this.exportModelFlag = false
        const SearchData = this.$refs.page.$refs.search._data.form
        const con = {
          pageNum: 1,
          pageSize: 999,
          rowList: this.rowList,
          ...SearchData,
        }
        // getExportStyleInfo(con, { responseType: 'arraybuffer' }).then((res) => {
        // application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
        //   var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'})
        //   var contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
        //   var patt = new RegExp("Filename=([^;]+\\.[^\\.;]+);*");
        //   var result = patt.exec(contentDisposition);
        //   var filename = result[1];
        //   var downloadElement = document.createElement('a');
        //   var href = window.URL.createObjectURL(blob); //创建下载的链接
        //   downloadElement.style.display = 'none';
        //   downloadElement.href = href;
        //   downloadElement.download = `商品列表-${filename}` ; //下载后文件名
        //   document.body.appendChild(downloadElement);
        //   downloadElement.click(); //点击下载
        //   document.body.removeChild(downloadElement); //下载完成移除元素
        //   window.URL.revokeObjectURL(href); //释放掉blob对象
        // }).catch(() => {
        // })
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择导出数据相关字段',
        })
      }
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

    handleCommand(command) {
      // const status = command
      const msg = command === 1 ? '下架' : '上架'
      this.$confirm(`确认${msg}已选择的商品吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // const con = {
        //   sId: styleId,
        //   status: status
        // }
        // if (status === 1 && !this.checkstyleColor()) {
        //   return;
        // }
        // updateStyleStatusById(con).then((res) => {
        //   if (res.head.status === 0) {
        //     this.$message({
        //       type: 'success',
        //       message: res.head.msg,
        //     })
        //     // row.status = status
        //   } else {
        //     this.$message({
        //       type: 'error',
        //       message: res.head.msg,
        //     })
        //   }
        // }).catch((err) => {
        //   console.log(err)
        // })
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

  ::v-deep .el-drawer__body{
    padding: 20px;
  }
  .ErrorInfo{
    padding:0 20px;
  }
</style>
