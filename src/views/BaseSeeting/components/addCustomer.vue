<template>
  <div class="ml-56" id="addMenu">
    <el-backtop target="#addMenu" :visibility-height="200" :right="70" :bottom="100" />

    <el-page-header @back="$router.back()" :content="editFlag?'编辑客户':'新增客户'" />
    <el-divider />
    <el-form
      style="margin-top:20px;"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="90px"
      :label-position="labelPosition"
      class="demo-ruleForm"
    >
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="ruleForm.realName" style="width:60%" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="联系人姓名" prop="contactPerson">
        <el-input v-model="ruleForm.contactPerson" style="width:60%;" placeholder="请输入联系人姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="contactNumber">
        <el-input v-model="ruleForm.contactNumber" style="width:60%;" placeholder="请输入联系电话" />
      </el-form-item>
      <!-- <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="ruleForm.realName" style="width:60%" placeholder="请输入真实姓名" />
      </el-form-item> -->
      <el-form-item label="地址" prop="customerAddress">
        <el-input v-model="ruleForm.customerAddress" style="width:60%;" placeholder="请输入地址" />
      </el-form-item>

      <!-- <el-form-item label="账号状态" prop="type">
        <el-select
          v-model="ruleForm.type"
          placeholder="请确认付费菜单类型"
          @change="changePayType"
          style="width:60%;"
        >
          <el-option label="有效" value="1" />
          <el-option label="无效" value="0" />
        </el-select>
      </el-form-item> -->

      <el-form-item label="客户类型" prop="customerType">
        <el-select
          v-model="ruleForm.customerType"
          placeholder="请确认该客户类型"
          style="width:60%;"
        >
          <el-option label="vip客户" :value="1" />
          <el-option label="普通客户" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" v-if="!editFlag" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addCustomer, changeCustomer } from '@/api/customer'

export default {
  name: 'AddMenu',
  components: {},
  data() {
    return {
      editFlag: false, // 是否是编辑菜单   false 新增  true 编辑
      userId: 1, // 即createdId
      pId: '', // 父菜单id   新增菜单时不选父菜单则默认为一级菜单，pId 传 "0"
      labelPosition: 'left',
      pMenu: {},

      menuOption: [],
      checked: false, // 是否新增根菜单

      ruleForm: {
        realName: '',
        contactPerson: '',
        contactNumber: 0,
        customerAddress: '',
        customerType: 0,
        id: '', // 客户id
        customerName: '',
        loginId: '',
      },
      rules: {
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        contactPerson: [
          { required: true, message: '请填写联系人姓名', trigger: 'blur' },
        ],
        contactNumber: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
        ],
        customerAddress: [
          { required: true, message: '请输入联系地址', trigger: 'blur' },
        ],
        customerType: [
          { required: true, message: '请选择客户类型', trigger: 'blur' },
        ],
      },

    }
  },
  created() {
    // console.log(this.$route.query.item)
    if (this.$route.query.item) {
      this.editFlag = true
      this.ruleForm.realName = this.$route.query.item.row.realName
      this.ruleForm.contactPerson = this.$route.query.item.row.contactPerson
      this.ruleForm.contactNumber = Number(this.$route.query.item.row.contactNumber)
      this.ruleForm.customerAddress = this.$route.query.item.row.customerAddress
      this.ruleForm.customerType = this.$route.query.item.row.customerType
      this.ruleForm.id = this.$route.query.item.row.id.toString()
      this.ruleForm.customerName = this.$route.query.item.row.customerName
      this.ruleForm.loginId = this.$route.query.item.row.logId
    }
    // if (this.$route.query.item) {
    // //   console.log(this.$route.query.item.row)
    // //   this.editFlag = true
    //   this.ruleForm = this.$route.query.item.row
    // //   if (this.ruleForm) {
    // //     this.ruleForm = this.ruleForm.path
    // //     if (this.ruleForm.path !== '0') {
    // //       this.pMenu.menuId = this.ruleForm.menuId
    // //     }
    // //     // // console.log("this.pMenu===",this.pMenu)
    // //   } else {
    // //     // // console.log('this.ruleForm.path====',this.ruleForm.path)
    // //     const arr = this.ruleForm.path.split(',')
    // //     // // console.log(this.ruleForm.path,arr);
    // //     this.pId = this.ruleForm.path
    // //     this.pMenu.menuId = arr[arr.length - 2]
    // //     // // console.log("this.pMenu===",this.pMenu)
    // //   }
    //   // this.pMenu = this.ruleForm.menuId;
    //   // // console.log("转为Number类型之后的 this.pMenu",this.pMenu)
    // }
    // this.userId = this.userId
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.realName) {
            changeCustomer({ code: '1', ...this.ruleForm }).then((res) => {
            //   console.log(res)
              if (res.head.status === 0) {
                this.$message({
                  message: '编辑菜单成功',
                  type: 'success',
                })
                this.$router.back()
              } else {
                this.$message({
                  message: res.head.msg,
                  type: 'warning',
                })
              }
            }).catch(() => {
            })
          } else {
            console.log('新增')
            // 新增菜单
            addCustomer({ code: '1', ...this.ruleForm }).then((res) => {
              this.editFlag = false
              console.log(res)
              if (res.head.status === 0) {
                // this.getTreeMenuList()
                this.$message({
                  message: '新增菜单成功',
                  type: 'success',
                })
                this.$router.back()
              } else {
                this.$message({
                  message: res.head.msg,
                  type: 'warning',
                })
              }
              this.getTreeMenuList()
            }).catch(err => {
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.pMenu = {}
    },
  },
}
</script>

<style lang="less" scoped>
#addMenu{
  height: calc(100vh - 180px);
  // height: 2000px;
  overflow:auto;
}
/deep/ .el-form-item__label {
   padding: 0 0;
}
</style>
