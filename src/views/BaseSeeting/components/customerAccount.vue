<template>
  <div style="height:100%">
    <div style="height:100%">
        <TablePage v-bind="tablePageOption" auto ref="table"> 
          <template slot="content:customerType" slot-scope="{ row }">
            {{ CUSTOMER_TYPE_TEXT[row.customerType] }}
          </template>
           <template slot="content:customerState" slot-scope="{ row }">
            {{ CUSTOMER_STATE_TEXT[row.customerState] }}
          </template>
        </TablePage>
      <!-- 出口 -->
      <router-view />
    </div>

    <!-- 导入客户 -->
    <el-drawer
      :title="'导入客户'"
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
          <el-button size="small" type="success" @click="confirmImportGoods">导入客户</el-button>
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

    <!-- 导出客户 -->
    <el-drawer
      title="请选择需要导出的字段"
      :visible.sync="exportModelFlag"
      :before-close="handleExportClose"
      direction="rtl"
      size="40%"
      ref="export"
    >
      <div class="text-center">
        <el-checkbox-group v-model="checkList" :checked="true" @change="changeChecked">
          <div
            style="text-align:left;margin:6px 0px;"
            v-for="(item,index) in exportInfoList"
            :key="index"
            class="text-center"
          >
            <el-checkbox
              :label="item.columnDesc"
              true-label
            >
              {{ item.columnDesc }}
            </el-checkbox>
          </div>
          
        </el-checkbox-group>
        <div style="margin-top: 20px">
          <el-button size="small" @click="cancelExport">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmExportCustomer">确 认</el-button>
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
      <div class="demo-drawer__content">
        <h3>{{addCount}}</h3>
        <h3>{{upDateCount}}</h3>
        <h3>{{failureCount}}</h3>
        <h3>失败数据如下:</h3>
        <ul class='errDataBox' style="text-align:left;">
          <li class='errDataItem'
              style="line-height:30px;"
              v-for='(item,index) in importErrData'
              :key='index'>{{item}}</li>
        </ul>
        <div style="margin-top: 20px">
          <el-button size="small" @click='cancelErrData'>取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getCustomer, delUserById, getExportinfo,getExportCustomer,changeCustomer } from '@/api/customer'
import axios from 'axios'

// 客户类型
const CUSTOMER_TYPE_TEXT = {
  0: '普通客户',
  1: 'VIP客户',
}

// 账号状态
const CUSTOMER_STATE_TEXT = {
  0:'有效',
  1:'无效'
}

export default {
  name: 'Style',
  components: {
    TablePage,
  },
  data() {
    return {
      CUSTOMER_TYPE_TEXT,
      CUSTOMER_STATE_TEXT,

      ErrerInfoShow: false,
      data: {},
      importFlag: false, // 导入客户显示隐藏
      exportModelFlag: false, // 导出客户显示隐藏
      fileList: [], // 上传的文件列表
      checkList: [], // 导出字段选中项
      exportInfoList: [], // 导出模板字段列表，由用户勾选，传参给导出接口
      tempCheckList: [], // 默认全部选中，先把选项临时存储起来，方便赋值操作
      rowList: null, // 导出传递的参数

      importErrDataFlag:false, // 导入显示
      addCount:null, // 导入错误数据
      upDateCount:null,
      failureCount:null,
      importErrData:null, // 导入失败数据列表
      errMessage: null,
    }
  },

  computed: {
    tablePageOption() {
      let operation = JSON.parse(this.$store.state.menu.menuOperation)
      let actions = [];
      let buttons = [];
      operation.forEach((item,index) => {
        if (item.statue == 1) {
          if (item.operationKey == 'update') {
            buttons.push({
              tip: '编辑',
              type: 'warning',
              icon: 'el-icon-edit',
              click: (scope) => this.$router.push({
                path: '/basls/customerAccount/addCustomer',
                query: { item: scope },
              }),
            })
          } else if (item.operationKey == 'delete') {
            buttons.push({
              tip: '删除',
              type: 'danger',
              icon: 'el-icon-delete',
              click: this.deleteCustomer,
            })
            
          } else if (item.operationKey == 'selectById') {
            buttons.push({
              tip: '查看客户详情',
              type: 'primary',
              icon: 'el-icon-view',
              click: (scope) => this.$router.push({
                path: '/basls/customerAccount/addCustomer',
                query: { item: scope , flag: 1},
              }),
            })
            
          } else if (item.operationKey == 'disable') {
            buttons.push({
              tip: ({ row }) => ['禁用', '启用'][row.customerState],
              type: ({ row }) => ['success'][row.customerState] || 'info',
              icon: ({ row }) => ['el-icon-open'][row.customerState] || 'el-icon-turn-off',
              click: this.changeState
            })
            
          } else if (item.operationKey == 'import') {
            actions.push({
              name: '导入客户',
              type: 'primary',
              icon: 'el-icon-download',
              click: () => this.importCustomer(),
            })
            
          } else if (item.operationKey == 'export') {
            actions.push({
              name: '导出客户',
              type: 'primary',
              icon: 'el-icon-upload2',
              click: () => this.exportCustomer(),
            })
            
          } else if (item.operationKey == 'insert') {
            actions.push({
              name: '新增客户',
              type: 'success',
              icon: 'el-icon-plus',
              click: () => this.$router.push('/basls/customerAccount/addCustomer'),
            })
          }
        }
      })
      return {
        promise: this.loadData,
        actions: actions,
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: buttons,
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
      let operation = JSON.parse(this.$store.state.menu.menuOperation)
      let selectOperation = ""
      operation.forEach(item => {
        if (item.operationKey == "selectAll" && item.statue == 1) {
          selectOperation = "selectAll"
        }
      })
      const con = {
        ...params,
        brandId:sessionStorage.brandId,
        code:'1',
        selectOperation: selectOperation
      }
      const res = await getCustomer(con)
      this.data = res.body
    },
    // 删除角色
    deleteCustomer(item) {
      this.$confirm('确认删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const con = {
          id: item.row.id,
          loginId:item.row.logId,
          code: '1',
        }
        delUserById(con).then((res) => {
          if (res.head.status === 0) {
            // 删除列表中点击删除的数据，item是被点击行的信息
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
              message: res.head.msg,
              type: 'warning',
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    // 导入客户
    importCustomer() {
      this.importFlag = true
    },
    // 导入错误数据的关闭操作
    handleImportErrClose(){
      this.$confirm('确认关闭？').then(_ => {
        this.importErrDataFlag = false;
      }).catch(_ => {});
    },
    // 错误数据取消操作
    cancelErrData(){
      this.importErrDataFlag = false;
    },
    // 导出客户字段
    exportCustomer() {
      this.exportModelFlag = true
      const con = {
        type: 'customerList',
        code: 'customer',
      }
      getExportinfo(con).then((res) => {
        if (res.head.status === 0) {
          this.exportInfoList = res.body.exportTitle
          // 实现点击导出默认全选效果
          for (let i = 0; i < this.exportInfoList.length; i++) {
            // console.log(this.exportInfoList[i]);
            this.tempCheckList.push(this.exportInfoList[i].columnDesc)
          }
            this.checkList = this.tempCheckList
        }
      })
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
    // 上传文件
    uploadFile(file) {
      this.fileData.append('file', file.file)
      // console.log(this.fileData)
    },
    // 确认导入客户文件
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
        const formData = new FormData() //  用FormData存放上传文件
        formData.append('file', this.fileList[0].raw)
        formData.append('brandId', sessionStorage.brandId)
        formData.append('code', '2')
        formData.append('userId', sessionStorage.userId)
        const BASE_URL = process.env.VUE_APP_BASE_URL
        axios({
          url: `${BASE_URL}/system/user/addImportCustomer`,
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
            this.$refs.table.loadData()
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
              message: '导入客户失败',
            })
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '导入客户失败',
          })
        })
      }
    },
    // 导入关闭提示
    handleImportClose() {
      this.$confirm('确认关闭？').then(() => {
        this.importGoodsClose()
      })
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
    // 导出关闭提示
    handleExportClose() {
      this.$confirm('确认关闭？').then(() => {
        this.exportModelFlag = false
        this.$refs.export.clearFiles()
      })
    },
    // 获取选中项的值
    changeChecked(val) {
      this.checkList = val
    },
    // 取消导出
    cancelExport() {
      this.exportModelFlag = false
      this.checkList = this.tempCheckList
    },
    // 确认导出
    confirmExportCustomer() {
      this.rowList = {}
      if (this.checkList.length > 0) {
        for(let i=0;i<this.checkList.length;i++){
          for(let j=0;j<this.exportInfoList.length;j++){
            if(this.checkList[i]==this.exportInfoList[j].columnDesc){
              this.rowList[this.exportInfoList[j].columnName] = this.exportInfoList[j].columnDesc;
            }
          }
        }
      }
      if (this.rowList) {
        this.exportModelFlag = false
        let SeaerchInfo = this.$refs.table.$refs.search._data.form
        const con = {
          // code: "1",
          pageNum: "1",
          pageSize: "999",
          rowList:this.rowList,
          ...SeaerchInfo
        }
        getExportCustomer(con,{responseType: 'arraybuffer'}).then((res) => {
            var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
            var contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
            var patt = new RegExp("Filename=([^;]+\\.[^\\.;]+);*");
            var result = patt.exec(contentDisposition);
            var filename = result[1];
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.style.display = 'none';
            downloadElement.href = href;
            downloadElement.download = `用户列表-${filename}` ; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择导出数据相关字段',
        })
      }
    },
    // 修改客户状态
    changeState(item) {
      const con = {
        id:item.row.id,
        customerState:item.row.customerState === 1 ? '0' :'1',
        loginId:item.row.logId,
        code:'1'
      }
      changeCustomer(con).then(()=> {
      this.$refs.table.loadData()
      })
    }
  },

}
</script>

<style lang="less" scoped>
/deep/ .el-table__body-wrapper {
    height: 500px;
}
.ErrorInfo{
  padding:0 20px;
}
</style>
