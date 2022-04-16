<template>
  <div>
    <div class="main container">
      <div class="tablel-h">
        <TablePage v-bind="tablePageOption" auto />
      </div>
      <!-- 出口 -->
      <router-view />
    </div>
    <!-- 导入客户 -->
    <el-drawer
      :title="'导入商品'"
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
          <el-button size="small" type="success" @click="confirmImportGoods">导入商品</el-button>
          <el-button size="small" @click="importFlag = false">取消导入</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import TablePage from '@/components/business/TablePage'
import { getCustomer, delUserById, addImportCustomer } from '@/api/customer'
import axios from 'axios'

export default {
  name: 'Style',
  components: {
    TablePage,
  },
  data() {
    return {
      data: {},
      importFlag: false, // 导入客户显示隐藏
      fileList: [], // 上传的文件列表
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
          {
            name: '导入客户',
            type: 'primary',
            icon: 'el-icon-download',
            click: () => this.importGoods(),
          },
          {
            name: '导出客户',
            type: 'primary',
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
                click: this.deleteCustomer,
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

  },
  methods: {
    async loadData() {
      const res = await getCustomer({
        pageNum: '1',
        pageSize: '999',
        code: '1',
      })
      // console.log(res)
      this.data = res.body
    },
    // 删除角色
    deleteCustomer(item) {
      this.$confirm('确认删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // console.log(item.row.id.toString())
        const con = {
          id: item.row.id.toString(),
          userId: sessionStorage.userId,
          code: '1',
        }
        delUserById(con).then((res) => {
          // console.log(res)
          // this.loadData()
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
              // this.$refs.child.parentMsgs(this.dynamicParam)
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
    // 导入商品
    importGoods() {
      this.importFlag = true
    },
    // 关闭提示
    handleImportClose() {
      this.$confirm('确认关闭？').then(() => {
        this.importFlag = false
        this.$refs.upload.clearFiles()
      }).catch(() => {})
    },
    // 监控上传文件列表
    changeFile(file, fileList) {
      console.log(file)
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
      console.log(this.fileData)
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
        const formData = new FormData() //  用FormData存放上传文件
        formData.append('file', this.fileList[0].raw)
        formData.append('brandId', sessionStorage.brandId)
        formData.append('code', '2')
        formData.append('userId', sessionStorage.userId)
        // console.log(formData)
        // console.log("formData====",formData)
        // 向webapi发起请求，等待后台接收
        axios({
          url: '/api/system/user/addImportCustomer',
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
            token: sessionStorage.accessToken,
          },
          data: formData,
        }).then((res) => {
          this.importFlag = false
          // console.log(res)
          this.$refs.upload.clearFiles()
          if (res.data.head.status === 0) {
            this.importResult = res.data.body
            this.addCount = res.data.body.addCount
            this.upDateCount = res.data.body.upDateCount
            this.failureCount = res.data.body.failureCount
            this.fileList = []
            this.fileData = ''
            if (res.data.body.errorStr && res.data.body.errorStr.length > 0) {
              this.importErrDataFlag = true
              this.importErrData = res.data.body.errorStr
            } else {
              this.$alert(`导入完成,${res.data.body.addCount},${res.data.body.upDateCount},${res.data.body.failureCount}`, '提示', {
                confirmButtonText: '确定',
                callback: action => {

                },
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
  },

}
</script>

<style lang="less" scoped>
/deep/ .el-table__body-wrapper {
    height: 600px;
}
</style>
