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
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" :disabled="editFlag" style="width:60%;" maxlength="20" placeholder="请选择用户名">
          <!-- <template slot="prepend" v-if="!editFlag">{{ brandAbbreviation }}</template> -->
        </el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="nickName">
        <el-input v-model="ruleForm.nickName" style="width:60%;" maxlength="20" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="ruleForm.telephone" style="width:60%;" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="账号类型" prop="accountType">
        <el-select v-model="ruleForm.accountType" placeholder="请选择">
          <el-option label="APP用户" value="0" />
          <el-option label="高单易管家用户" value="1" />
          <el-option label="APP及管家用户" value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="所属店铺/区域" v-if="editFlag">
        <el-cascader
          style="width:60%;"
          ref="chooseOption"
          :options="orgList"
          filterable
          :show-all-levels="false"
          :props="{ checkStrictly: true, children:'childrenList',value:'id',label:'osName'}"
          @change="changeShop"
        />
      </el-form-item>

      <!-- <el-form-item label="用户密码" prop="passWord">
        <el-input v-model="ruleForm.passWord" style="width:60%;" type="password" placeholder="用户密码" />
        <div v-if="editFlag" class="pwdTip"><i class="el-icon-magic-stick" style="font-size:16px;margin-right:6px;color:#e60012;"></i>若要修改请直接输入新密码保存即可</div>
        <div v-else class="pwdTip"><i class="el-icon-magic-stick" style="font-size:16px;margin-right:6px;color:#e60012;"></i>不填则为默认密码</div>
      </el-form-item> -->
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
// import bus from '@/assets/js/js/eventBus'
// import CryptoJS from '@/assets/js/js/CryptoJS'
import { addCustomer, changeCustomer } from '@/api/customer'
import { getTreeOrgList } from '@/api/org'

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
        orgNum:'', // 级联选中的值
        orgList: [], // 级联数据源
        editFlag: false,
        ruleForm: {
        orgStId: '',
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
        loginId:''
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
      console.log(this.$route.query)
      this.editFlag = true
      this.ruleForm = this.$route.query.item.row
      this.ruleForm.passWord = ''
      // this.orgNum = 
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
        console.log(res);
      if(res.head.status === 0) {
        this.orgList = res.body.resultMap
        // this.orgNum = 
      }
      })
    },
    // 修改所属店铺或者区域
    changeShop(val) {
      // console.log("val=====",val);
      const checkedNodeList = this.$refs.chooseOption.getCheckedNodes()
      if (checkedNodeList[0]) {
        // this.checkedNode = checkedNodeList[0]
        this.nodeId = this.checkedNode.data.id
        this.nodeType = this.checkedNode.data.isShop ? this.checkedNode.data.isShop : '0'
      }

      // this.checkedNode = this.$refs.chooseOption.getCheckedNodes();
      // console.log("选中的节点=======",this.checkedNode)
    },
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
      }
      return true
    },

     submitForm(formName) {
      //  console.log(formName);
      this.$refs.ruleForm.validate((valid) => {
        if(valid) {
          // 新增
          if(!this.editFlag) {
            const con = {
              brandId: sessionStorage.brandId,
              userId: sessionStorage.userId,
              ...this.ruleForm,
              orgStId:this.ruleForm.orgStId,
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
          console.log(this.ruleForm);
          const con = {
            ...this.ruleForm
          }
           changeCustomer(con).then((res) => {
              if (res.head.status === 0) {
                this.$message({
                  message: '修改用户信息成功',
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

    // submitForm(formName) {
    //   _this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       if(this.editFlag) {
    //         console.log('新增');
    //                     const con = {
    //           brandId: sessionStorage.brandId,
    //           userId: sessionStorage.userId,
    //           ...this.ruleForm,
    //           code: '2',
    //         }
    //         addCustomer(con).then(() => {
    //           this.$router.back()
    //         })
    //         // c
    //       }
    //       let encryPwd = null
    //       if (_this.ruleForm.passWord) {
    //         encryPwd = CryptoJS.encrypt(this.ruleForm.passWord)
    //       }
    //       // console.log('加密后的密码===',encryPwd);
    //       // 密码的处理逻辑：
    //       // 非必填，不填传参为空，后台取默认值六个一，传参的话，使用AES加密，将加密后的字符串传给后台，后台解密后再MD5存储
    //       if (this.editFlag) {
    //         // 编辑用户接口
    //         const con = {
    //           // id: _this.ruleForm.id,
    //           // userName: _this.ruleForm.userName,
    //           // // passWord:_this.ruleForm.passWord,  // passWord逻辑待定
    //           // passWord: encryPwd,
    //           // status: _this.ruleForm.status, // status页面也没让改,传参多余么
    //           // accountType: _this.ruleForm.accountType,
    //           // telephone: _this.ruleForm.telephone,
    //           // headPortrait: _this.ruleForm.headPortrait,
    //           // job: _this.ruleForm.job,
    //           // sex: _this.ruleForm.sex,
    //           // nickName: _this.ruleForm.nickName,
    //           // userId: sessionStorage.userId,
    //           // address: _this.ruleForm.address,
    //           // autograph: _this.ruleForm.autograph,
    //           // hireDate: _this.ruleForm.hireDate,
    //           // birthDate: _this.ruleForm.birthDate,
    //           // // 修改用户所属店铺或区域
    //           // isShop: _this.nodeType,
    //           // // 0 区域 1 店铺 2 品牌  为1或2时isShop有值 为null 自己取'0'
    //           // nodeId: _this.nodeId,
    //           ...this.ruleForm,
    //         }
    //         changeCustomer(con).then((res) => {
    //           console.log(res)
    //         })
    //         // const jsonParam = _this.GLOBAL.g_paramJson(con)
    //         // // console.log("jsonParam===",jsonParam)
    //         // _this.$axios.post(`${_this.GLOBAL.system_manager_server}/user/updateUserById`, jsonParam).then((res) => {
    //         //   // console.log("编辑用户接口返回信息==========",res.data.body);
    //         //   if (res.data.head.status === 0) {
    //         //     _this.$message({
    //         //       message: '编辑保存成功',
    //         //       type: 'success',
    //         //     })
    //         //     if (_this.ruleForm.accountType === '0') {
    //         //       _this.ruleForm.accountTypeMsg = 'APP用户'
    //         //     }
    //         //     if (_this.ruleForm.accountType === '1') {
    //         //       _this.ruleForm.accountTypeMsg = '管家用户'
    //         //     }
    //         //     if (_this.ruleForm.accountType === '3') {
    //         //       _this.ruleForm.accountTypeMsg = 'APP及管家用户'
    //         //     }
    //         //     if (_this.ruleForm.sex === '1') {
    //         //       _this.ruleForm.sexMsg = '女'
    //         //     }
    //         //     if (_this.ruleForm.sex === '0') {
    //         //       _this.ruleForm.sexMsg = '男'
    //         //     }
    //         //     if (_this.oldNodeId === _this.nodeId) {
    //         //       _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
    //         //       _this.$router.back()
    //         //     } else {
    //         //       _this.$set(_this.ruleForm, 'changeShopFlag', true)
    //         //       _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
    //         //       _this.$router.back()
    //         //     }
    //         //   } else {
    //         //     _this.$message({
    //         //       message: res.data.head.msg,
    //         //       type: 'warning',
    //         //     })
    //         //   }
    //         // }).catch(err => {
    //         //   // console.log(err)
    //         // })
    //       } else {
    //         // 新增用户接口
    //         // let curUserName = ''
    //         // if (_this.brandAbbreviation) {
    //         //   curUserName = `${_this.brandAbbreviation}${_this.ruleForm.userName}`
    //         // } else {
    //         //   curUserName = _this.ruleForm.userName
    //         // }
    //         // const con = {
    //         //   brandId: sessionStorage.brandId,
    //         //   userId: sessionStorage.userId,
    //         //   ...this.ruleForm,
    //         //   code: '2',
    //         // }
    //         // addCustomer(con).then(() => {
    //         //   this.$router.back()
    //         // })
    //         // // const jsonParam = _this.GLOBAL.g_paramJson(con)
    //         // _this.$axios.post(`${_this.GLOBAL.system_manager_server}/user/insertUser`, jsonParam).then((res) => {
    //         //   // console.log("新增用户接口返回信息==========",res.data.body);
    //         //   if (res.data.head.status === 0) {
    //         //     _this.$message({
    //         //       message: '新增保存成功',
    //         //       type: 'success',
    //         //     })

    //         //     _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
    //         //     _this.$router.back()
    //         //   } else {
    //         //     _this.$message({
    //         //       message: res.data.head.msg,
    //         //       type: 'warning',
    //         //     })
    //         //   }
    //         // }).catch(err => {
    //         //   // console.log(err)
    //         // })
    //       }
    //     } else {
    //       // console.log('error submit!!');
    //       return false
    //     }
    //   })
    // },
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
