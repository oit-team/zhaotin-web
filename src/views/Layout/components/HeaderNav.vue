<template>
  <nav class="h-16 bg-black">
    <div class="container">
      <div class="flex">
        <div class="h-16 w-44"><img class="h-full" src="../../../assets/icon/header/logo2.svg" alt="" /></div>
        <ul
          class="flex-1 px-16 flex items-center text-gray-50 divide-x divide-white-500 justify-center point"
        >
          <el-popover
            :disabled="!item.childrenMenu"
            placement="bottom"
            trigger="hover"
            v-for="item in list"
            :key="item.menuName"
            class="px-5"
            popper-class="userheader"
          >
            <div v-if="item.childrenMenu">
              <ul v-for="(items,index) in item.childrenMenu" :key="index" class="leading-6 font-medium">
                <li class="text-center"><div :class="$route.fullPath === items.menuUrl ? 'box-color': '' " @click="skipSecond(items)">{{ items.menuName }}</div></li>
              </ul>
            </div>
            <template #reference>
              <div @click="skip(item)" :class="$route.fullPath === item.menuUrl || $route.redirectedFrom === item.menuUrl ? 'box-color': '' ">{{ item.menuName }}</div>
            </template>
          </el-popover>
        </ul>
        <div class="tracking-wider flex items-center text-gray-50">
          <el-popover
            :disabled="!userinfo"
            placement="bottom"
            trigger="hover"
            class="px-5"
            content="测试"
            popper-class="userheader"
          >
            <div v-if="userinfo">
              <ul class="diivide-y-4 divide-dotted leading-6 font-medium">
                <li class="text-center" @click="quit">退出登录</li>
                <li class="text-center" @click="updatePwd">修改密码</li>
              </ul>
            </div>
            <template #reference>
              <div v-if="userinfo">
                <span style="display: inline-block;float: left;max-width: 220px;overflow:hidden;white-space:nowrap; text-overflow:ellipsis;">
                  {{ userinfo.showName }}
                </span>
                <img
                  class="inline-block leading-10 ml-2"
                  src="../../../assets/icon/header/down.svg"
                  alt=""
                />
              </div>
              <div
                class="inline-block leading-10 ml-2"
                v-else
                @click="$router.push('/login')"
              >
                请点击登录
              </div>
            </template>
          </el-popover>
          <div class="space-x-4 ml-2">
            <img class="inline-block leading-10" src="../../../assets/icon/header/msg.svg" alt="" />
            <img class="inline-block leading-10" src="../../../assets/icon/header/servicer.svg" alt="" />
          </div>
        </div>
      </div>
      <el-drawer
        title="修改密码"
        :visible.sync="drawer"
      >
        <div class="demo-drawer__content">
          <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdForm" class="px-8">
            <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPwd">
              <el-input v-model="pwdForm.oldPwd" autocomplete="off" type="password" placeholder="请输入旧密码" />
            </el-form-item>
            <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPwd">
              <el-input v-model="pwdForm.newPwd" autocomplete="off" type="password" maxlength="32" placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth" prop="conNewPwd">
              <el-input v-model="pwdForm.conNewPwd" autocomplete="off" type="password" placeholder="请确认新密码" />
            </el-form-item>
          </el-form>
          <!-- <div class="roleTips"> <i class="el-icon-magic-stick" style="font-size:16px;margin-right:6px;"></i>选择单用户时，可查看该用户已授权的角色。</div> -->
          <div class="text-center">
            <el-button size="small" type="primary" @click="confirmChangePwd('pwdForm')">确 认</el-button>
            <el-button size="small" @click="resetPwd('pwdForm')">重置</el-button>
            <el-button size="small" @click="cancelChangePwd('pwdForm')">取 消</el-button>
          </div>
        </div>
      </el-drawer>
      <!-- <router-link to="/HomeView" class="text-red-500">Home</router-link> |
      <router-link to="/about" class="text-red-500">About</router-link> -->
    </div>
  </nav>
</template>

<script>
import { getTreeMenuList } from '@/api/product'
import { updatePassWord } from '@/api/user'
import CryptoJS from '@/assets/js/js/CryptoJS'

export default {
  name: 'HeaderNav',
  components: {
  },

  data() {
    return {
      formLabelWidth: '100px',
      drawer: false,
      pwdForm: {
        oldPwd: '',
        newPwd: '',
        conNewPwd: '',
      },
      list: [],
      showTips: true,
      userinfo: JSON.parse(sessionStorage.getItem('userinfo')),
      pwdFormRules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          {
            min: 6, max: 20, message: '长度在 2 到 20 个字符以内', trigger: 'blur',
          },
          { pattern: /^[A-Za-z0-9]{6,20}$/, message: '只能输入6-20位字母、数字组合', trigger: 'blur' },
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            min: 6, max: 20, message: '长度在 2 到 20 个字符以内', trigger: 'blur',
          },
          { pattern: /^[A-Za-z0-9]{6,20}$/, message: '只能输入6-20位字母、数字组合', trigger: 'blur' },
        ],
        conNewPwd: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            min: 6, max: 20, message: '长度在 2 到 20 个字符以内', trigger: 'blur',
          },
          { pattern: /^[A-Za-z0-9]{6,20}$/, message: '只能输入6-20位字母、数字组合', trigger: 'blur' },
        ],
      },
      urlNew: '',
    }
  },

  created() {
    this.getTreeMenuList()
  },

  methods: {
    async getTreeMenuList() {
      const res = await getTreeMenuList({
        userId: JSON.parse(sessionStorage.getItem('userinfo')).id,
        brandId: JSON.parse(sessionStorage.getItem('userinfo')).brandId,
      })
      this.list = res.body.resultList
    },
    skip(item) {
      sessionStorage.setItem('headTitString', item.fieldDes)
      if (sessionStorage.getItem('headTitString')) {
        if (!item.childrenMenu) {
          this.$router.push(item.menuUrl)
        }
      }
    },
    skipSecond(items) {
      sessionStorage.setItem('headTitString', items.fieldDes)
      if (sessionStorage.getItem('headTitString')) {
        this.$router.push(items.menuUrl)
      }
    },
    quit() {
      localStorage.clear()
      sessionStorage.clear()
      this.$router.push('/login')
    },
    updatePwd() {
      this.drawer = true
    },
    resetPwd(formName) {
      // console.log("重置密码");
      this.$refs[formName].resetFields()
    },
    cancelChangePwd(formName) {
      // console.log("取消修改密码");
      this.$refs[formName].resetFields()
      this.drawer = false
    },
    confirmChangePwd(formName) {
      // console.log("确认修改密码");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.pwdForm.newPwd !== this.pwdForm.conNewPwd) {
            this.$message({
              type: 'warning',
              message: '新密码两次输入不一致，请确认',
            })
          } else {
            // 调用接口执行修改逻辑

            const oldEncryPwd = CryptoJS.encrypt(this.pwdForm.oldPwd)
            const newEncryPwd = CryptoJS.encrypt(this.pwdForm.newPwd)
            const con = {
              oldPassword: oldEncryPwd,
              newPassword: newEncryPwd,
            }
            updatePassWord(con).then((res) => {
              // console.log("delMenuById==========",res.data.body);
              if (res.head.status === 0) {
                // console.log("修改密码成功===")
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                })
                this.$refs[formName].resetFields()
                this.drawer = false
              } else {
                this.$message({
                  message: res.head.msg,
                  type: 'warning',
                })
              }
            }).catch(() => {
            })
          }
        } else {
          return false
        }
      })
    },
  },
}

</script>
<style lang='scss' scoped>
.box-color {
  color: #eab308;
}
.userheader {
  width: 80px;
  transform: translateY(8px);
  cursor: pointer;
}
.point {
  cursor: pointer;
}
.secondColor {
  color:  #eab308;
}
</style>
