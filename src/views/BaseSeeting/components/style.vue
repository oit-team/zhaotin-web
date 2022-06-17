<template>
  <div style="height: 100%;">
    <div class="main container" style="height: 100%;">
      <!-- <div>商品中心</div> -->
      <div class="table-h" style="height: 100%;">
        <TablePage v-bind="tablePageOption" auto ref="page">
          <template #actions:upd>
            <el-dropdown class="ml-2">
              <el-button type="primary">
                上/下架<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="updGoods(0)">商品上架</el-dropdown-item>
                <el-dropdown-item @click.native="updGoods(1)">商品下架</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <!-- <el-drawer :visible.sync="drawerVisible" size="40%"> -->
          <template slot="content:resUrl" slot-scope="{ row }">
            <!-- 商品图片 -->
            <template v-if="row.resUrl">
              <el-image class="file-res" style="max-height:50px;" :src="row.resUrl" fit="cover" />
            </template>
            <template v-else>
              <span>无</span> 
            </template>
          </template>
          <template slot="content:status" slot-scope="{ row }">
            <!-- 商品图片 -->
            <span v-if="row.status == 1" style="color:#67C23A">
              已上架
            </span>
            <span v-else-if="row.status == 0" style="color:red">
              未上架
            </span>
          </template>
          <template slot="content:styleColor" slot-scope="{ row }">
            <!-- 商品颜色 -->
           <span v-if="row.styleColor">
              {{row.styleColor}}
            </span>
            <span v-else>
              无
            </span>
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
      size="40%"
      :before-close="handleImportClose"
    >
      <div class="text-center" v-show="!ErrerInfoShow">
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
          <el-button size="small" @click="importGoodsClose">取消导入</el-button>
        </div>
      </div>
      <div class="ErrorInfo" v-show="ErrerInfoShow">
        <h3>{{ addCount }}</h3>
        <h3>{{ upDateCount }}</h3>
        <h3>{{ failureCount }}</h3>
        <h3>失败数据如下:</h3>
        <p>{{errMessage}}</p>
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
          <el-button size="small" @click="importGoodsClose">取消</el-button>
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
          <el-button size="small" @click="exportModelFlag =false">取 消</el-button>
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
        <p>{{errMessage}}</p>
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
          <el-button size="small" @click="importErrDataFlag = false">取消</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 上架失败 -->
    <el-drawer
      title="上/下架日志信息"
      :visible.sync="drawerUpd"
      direction="rtl"
      ref="drawerUpd"
      wrapper-closable
    >
      <div v-for="item in errorList" class="mb-4" :key="item.recordId">
        <div v-html="item"></div>
        <el-divider />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getProductList } from '@/api/product'
import { getDeleteStyleInfo, getExportInfo, getExportStyleInfo, addimporStyleInfo, updateStyleStatusById } from '@/api/goods'
import axios from 'axios'

export default {
  name: 'Style',
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
    }
  },

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
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
            slot: 'upd',
          },
          // {
          //   name: '导入库存',
          //   icon: 'el-icon-download',
          //   type: 'primary',
          //   click: () => this.importStock(),
          // },
        ],
        table: {
          selection: true,
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
                  query: { item: scope , flag: 1},
                }),
              },
              {
                tip: '删除',
                type: 'danger',
                icon: 'el-icon-delete',
                click: this.deleteGoods,
                disabled: ({ row }) => {
                  if (row.status == '1') {  //1 是已上架
                    return true
                  } else if (row.status == '0') {
                    return false
                  }
                },
              },
              {
                tip: '编辑商品',
                type: 'success',
                icon: 'el-icon-edit',
                disabled: ({ row }) => {
                  if (row.status == '1') {  //1 是已上架
                    return true
                  } else if (row.status == '0') {
                    return false
                  }
                },
                click: (scope) => this.$router.push({
                  path: '/basls/style/addGoods',
                  query: { item: scope , flag : 0},
                }),
              },
              // {
              //   tip: '库存分布',
              //   // type: 'danger',
              //   icon: 'el-icon-s-data',
              //   isShow: true,
              //   click: ({ row }) => this.$router.push({
              //     // path: '/system/addRole',
              //     params: { item: row },
              //   }),
              // },
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
  activated() {
    this.$refs.page.loadData()
  },
  methods: {
    isDisabled(row) {
      console.log(row)
    },
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
        type: 'styleList',
        code: 'style',
      }
      getExportInfo(con).then((res) => {
        if (res.head.status == 0) {
          this.exportInfoList = res.body.exportTitle
          for (let i = 0; i < this.exportInfoList.length; i++) {
            this.tempCheckList.push(this.exportInfoList[i].columnName)
          }
          this.checkList = this.tempCheckList
          // console.log("默认全选===",this.checkList)
        } else {
          this.$message({
            message: res.head.msg,
            type: 'warning',
          })
        }
      }).catch(err => {
        // console.log(err)
      })
    },
    // 删除商品
    deleteGoods(item) {
      this.$confirm('确认删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // console.log(item)
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
        console.log(789)
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
                callback: action => {},
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
    handleExportClose () {
      this.$confirm('确认关闭？').then(() => {
        this.exportModelFlag = false
      }).catch(() => {})
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
    upDrop() {
      // this.
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
        const _this = this;
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
          token: sessionStorage.accessToken,
          },
          data: formData,
        }).then((res) => {
          if (res.status === 200 && res.data.head.status == 0) {
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
                callback: action => {
                  this.importGoodsClose()
                },
              })
            }
          } else {
            this.ErrerInfoShow = true;
            this.errMessage = res.data.head.msg
            this.$message({
              type: 'error',
              message: '导入商品失败',
            })
          } 
        }).catch((err) => {
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
      console.log("复选框变化后的值===",val);
      this.checkList = val
    },
    // 确认导出商品按钮
    confirmExportGoods() {
      this.rowList = {}
      if (this.checkList.length > 0) {
        for(let i=0;i<this.checkList.length;i++){
          for(let j=0;j<this.exportInfoList.length;j++){
            if(this.checkList[i]==this.exportInfoList[j].columnName){
              this.rowList[this.exportInfoList[j].columnName] = this.exportInfoList[j].columnDesc;
            }
          }
        }
      }
      if (Object.keys(this.rowList).length > 0) {
        this.exportModelFlag = false
        const SearchData = this.$refs.page.$refs.search._data.form
        const con = {
          pageNum:1,
          pageSize:999,
          rowList:this.rowList,
          ...SearchData
        }
        getExportStyleInfo(con,{responseType: 'arraybuffer'}).then((res) => {
          var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
          var contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
          var patt = new RegExp("Filename=([^;]+\\.[^\\.;]+);*");
          var result = patt.exec(contentDisposition);
          var filename = result[1];
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.style.display = 'none';
          downloadElement.href = href;
          downloadElement.download = `商品列表-${filename}` ; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择导出数据相关字段',
        })
      }
    },
    //上架前判断该商品各个颜色是否都有图片和尺码
    checkstyleColor (row) {
      console.log(row)
      let returnRes = true
      if (row.styleColor == '') {
        this.$message({
          type: 'warning',
          message: '发布前请上传颜色',
        })
        return false
      } else {
        /*row.styleColorList.forEach((item,index) => {
          console.log(item)
          if (!item.styleSize || item.styleSize.length == 0) {
            //尺码未设置
            returnRes = false 
          } else if (!item.styleImg || item.styleImg.length == 0){
            returnRes = false 
            //图片未上传
          }
        })*/
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
      console.log(command)
      let status = command
      let msg = command === 1?'下架':'上架'
      this.$confirm(`确认${msg}已选择的商品吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const con = {
          sId: styleId,
          status: status
        }
        // if (status == 1 && !this.checkstyleColor()) {
        //   return;
        // }
        // updateStyleStatusById(con).then((res) => {
        //   if (res.head.status == 0) {
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
    updGoods(id) {
      let status = id === 1? '0' : '1'
      let msg = id === 1 ? '下架' : '上架'
      const con = {
        sId: [],
        status: status,
      }
      this.$confirm(`确认${msg}该商品?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$refs.page.selected.forEach(e => {
          const list = {
            styleId: e.styleId,
            styleNo: e.styleNo,
          }
          con.sId.push(list)
        })
        updateStyleStatusById(con).then((res) => {
          this.errorList = JSON.parse(JSON.stringify(res.body.errorList))
          // 否则成功
          if (res.body.errorList.length === 0) {
            this.$message({
              type: 'success',
              message: res.head.msg,
            })
          } else {
            // 如果有失败的数据  则弹出--抽屉
            this.drawerUpd = true
          }
        })
        setTimeout(() => {
          this.$refs.page.loadData()
          this.$forceUpdate()
        }, 1000)
        }).catch((err) => {
          console.log(err)
      }).catch(() => {})
    },
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
  
  ::v-deep .el-drawer__body{
    padding: 20px;
  }
  .ErrorInfo{
    padding:0 20px;
  }
</style>
