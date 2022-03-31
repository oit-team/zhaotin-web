<template>
  <div>
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="formData.userName" placeholder="用户名" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password" placeholder="密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- <div id="login">
    <div class="login_head">
      <div class="content">
        <div class="contentLeft">
          <img src="../assets/css/login/img/loginLeft.png" alt="" />
        </div>
        <div class="contentRight">
          <div class="right">
            <div class="right_title">高单易管家</div>
            <el-form>
              <el-form-item>
                <el-input v-model.trim="formData.userName" clearable placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item>
                <el-input type="password" v-model.trim="formData.passWord" clearable placeholder="请输入密码"
                @keyup.enter.native="login('formData')" />
              </el-form-item>
            </el-form>

            <div class="loginBtn">
              <el-button type="primary" class="btn_submit" @click="login('formData')">登 录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import { reqLogin } from '@/api/user'

export default {
  data: () => ({
    formData: {
      userName: 'admin',
      password: 'bk7fL7wA47fM1cl9I9h3qQ==',
    },
  }),
  methods: {
    async login() {
      const res = await reqLogin(this.formData)
      this.$store.commit('getUserinfo', res.body)
      // // console.log(localStorage.getItem('token'))
      // localStorage.setItem('token', res.body.accessToken)
    },
  },
}
</script>

<style lang="scss" scoped>
  // @import "../assets/css/login/css/login";
</style>
