<template>
  <div class="ml-64" id="addUser">
    <el-backtop target="#addUser" :visibility-height="200" :right="70" :bottom="100" />
    <el-page-header @back="goBack" :content="editFlag?'编辑用户':'新增用户'" />
    <el-divider />

    <el-form
      style="margin-top:20px;"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="106px"
      label-position="left"
      class="demo-ruleForm"
    >
<!--     <el-form-item v-if="userN" label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" :disabled="editFlag" style="width:60%;" maxlength="20" placeholder="请选择用户名">
          <template slot="prepend" v-if="!editFlag">{{ brandAbbreviation }}</template>
        </el-input>
      </el-form-item> -->
      <el-form-item label="真实姓名" prop="nickName">
        <el-input v-model="ruleForm.nickName" style="width:60%;" maxlength="20" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="ruleForm.telephone" style="width:60%;" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="账号类型" prop="accountType">
        <el-select v-model="ruleForm.accountType" placeholder="请选择">
          <el-option label="APP用户" value="0" />
          <el-option label="管家用户" value="1" />
          <el-option label="APP及管家用户" value="3" />
        </el-select>
      </el-form-item>

        <el-form-item label="用户密码" prop="passWord">
        <el-input v-model.trim="ruleForm.passWord" style="width:60%;" type="password" placeholder="用户密码" />
        <div v-if="editFlag" class="pwdTip"><i class="el-icon-magic-stick" style="font-size:16px;margin-right:6px;color:#e60012;"></i>若要修改请直接输入新密码保存即可</div>
        <div v-else class="pwdTip"><i class="el-icon-magic-stick" style="font-size:16px;margin-right:6px;color:#e60012;"></i>不填则为默认密码</div>
      </el-form-item>

      <el-form-item label="所属区域" v-if="editFlag">
        <el-cascader
          style="width:60%;"
          ref="chooseOption"
          :value="osName"
          :options="orgList"
          filterable
          :show-all-levels="false"
          :props="{ checkStrictly: true, children:'childrenList',value:'osName',label:'osName'}"
          @change="changeArea"
        />
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-select v-model="ruleForm.sex" placeholder="请选择">
          <el-option label="男" value="0" />
          <el-option label="女" value="1" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="职位" prop="job">
        <el-input v-model="ruleForm.job" style="width:60%;" maxlength="20" placeholder="请输入职位" />
      </el-form-item> -->

      <!-- <el-form-item label="出生日期" prop="birthDate">
        <el-date-picker
          v-model="ruleForm.birthDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        />
      </el-form-item> -->

      <el-form-item label="入职日期" prop="hireDate">
        <el-date-picker
          v-model="ruleForm.hireDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="ruleForm.address" style="width:60%;" maxlength="32" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="个人签名" prop="autograph">
        <el-input v-model="ruleForm.autograph" style="width:60%;" maxlength="32" placeholder="请输入个人签名" />
      </el-form-item>

      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" v-if="!editFlag" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CryptoJS from '@/assets/js/js/CryptoJS'
import { addCustomer, changeCustomer } from '@/api/customer'
import { getTreeOrgList } from '@/api/brand'

export default ({
  name: 'AddUser',
  components: {},
  data() {
    const checkphone = (rule, value, callback) => {
      const phoneReg = /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/
      if (value === '') {
        callback(new Error('请输入联系电话'))
      } else if (!phoneReg.test(value)) { // 引入methods中封装的检查手机格式的方法
        callback(new Error('号码格式不正确或者位数不正确!'))
      } else {
        callback()
      }
    }

    return {
      areaId:'',
      userN:true,
        orgList: [], // 级联数据源
        osName:[],
        orgId:'',
        editFlag: false,
        ruleForm: {
        userName: '',
        nickName: '',
        telephone: '',
        passWord: '',
        sex: '',
        // job: '',
        accountType: '',
        // birthDate: '',
        address: '',
        autograph: '',
        loginId:'',
        hireDate:''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur',
          },
        ],
        nickName: [
          { required: true, message: '请输入用户真实姓名', trigger: 'blur' },
          {
            min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur',
          },
        ],
        passWord: [
          { required: false, trigger: 'blur' },
          {
            min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur',
          },
          { pattern: /^[A-Za-z0-9]{6,20}$/, message: '只能输入6-20位字母、数字组合' },
        ],
        telephone: [
          { required: true, validator: checkphone, trigger: 'blur' },
        ],
        accountType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' },
          // { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        ],
        job: [
          { required: false, trigger: 'blur' },
          {
            min: 0, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur',
          },
        ],
        address: [
          { required: false, trigger: 'blur' },
          {
            min: 0, max: 32, message: '长度在 0 到 32 个字符', trigger: 'blur',
          },
        ],
        autograph: [
          { required: false, trigger: 'blur' },
          {
            min: 0, max: 32, message: '长度在 0 到 32 个字符', trigger: 'blur',
          },
        ],

      },

    }
  },
  created() {
    // 编辑
    if (this.$route.query.item) {
      this.getTreeOrgList()
      // console.log(this.$route.query.item.row.hireDate.substr(0,10));
      this.editFlag = true
      this.ruleForm = this.$route.query.item.row
      if(this.$route.query.item.row.hireDate) {
        this.ruleForm.hireDate = this.$route.query.item.row.hireDate.substring(0,10)
      }
      this.osName = this.$route.query.item.row.nodeName
      this.orgId = this.$route.query.item.row.id
    }
    // 新增
    if (this.$route.query) {
      this.ruleForm.orgStId = this.$route.query.orgStId
    }
  },
  mounted() {
    this.getTreeOrgList()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // 获取区域列表
    async getTreeOrgList() {
      await getTreeOrgList({
        brandId: sessionStorage.brandId,
      }).then((res) => {
      if(res.head.status === 0) {
        this.orgList = res.body.orgList
      }
      })
    },
    // 修改所属区域
    changeArea(val) {
      let checkedNodeList = this.$refs.chooseOption.getCheckedNodes()
       if(checkedNodeList) {
        this.areaId = checkedNodeList[0].data.id
       }
    },
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
      }
      return true
    },

     submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if(valid) {
          console.log(this.ruleForm.passWord)
          // 新增
          if(!this.editFlag) {
            const encryPwd = this.ruleForm.passWord ? CryptoJS.encrypt(this.ruleForm.passWord) : ''
            const con = {
              brandId: sessionStorage.brandId,
              userId: sessionStorage.userId,
              ...this.ruleForm,
              passWord: this.ruleForm.passWord === '' ? '' : encryPwd,
              orgStId: this.ruleForm.orgStId,
              code: '2',
            }
            addCustomer(con).then((res) => {
             if (res.head.status === 0) {
                this.$message({
                  message: '新增用户成功',
                  type: 'success',
                })
                this.$router.back()
              } else {
                this.$message({
                  message: res.head.msg,
                  type: 'warning',
                })
              }
            })
          } else { // 编辑
            const encryPwd = this.ruleForm.passWord ? CryptoJS.encrypt(this.ruleForm.passWord) : ''
            const con = {
             brandId: sessionStorage.brandId,
              userId: sessionStorage.userId,
              ...this.ruleForm,
              passWord: encryPwd,
              code: '2',
              orgStId:this.areaId,
              id:this.orgId
          }
            changeCustomer(con).then((res) => {
              if (res.head.status === 0) {
                this.$message({
                  message: '编辑用户成功',
                  type: 'success',
                })
                this.$router.back()
              } else {
                this.$message({
                  message: res.head.msg,
                  type: 'warning',
                })
              }
           })
          }
        }
      })
     },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

  },
})
</script>

<style lang="less" scoped>
#addUser{
  .pwdTip{
    text-align: left;
    line-height: 24px;
  }
  @deep:~">>>";
  // height: calc(100vh - 180px);
  @{deep} .el-select{
    width:60%;
  }
  @{deep} .el-date-editor.el-input{
    width:60%;
  }
  @{deep} .el-form-item {
    margin-bottom: 18px;
  }

}
</style>
