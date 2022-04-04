<template>
  <div id="login">
    <div class="login_head">
      <div class="content">
        <div class="contentLeft">
          <img src="../../assets/loginLeft.png" alt="" />
        </div>
        <div class="contentRight">
          <div class="right">
            <div class="right_title">昭廷</div>
            <el-form>
              <el-form-item>
                <el-input v-model.trim="formData.userName" clearable placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item>
                <el-input type="password" v-model.trim="formData.password" clearable placeholder="请输入密码" />
              </el-form-item>
            </el-form>
            <div class="loginBtn">
              <el-button type="primary" class="btn_submit" @click="login">登 录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
      this.$router.push('/')
    },
  },
}
</script>

<style lang="less" scoped>
#login{
  @deep:~">>>";
  width:100%;
  height:100%;
  .login_head{
    width:100%;
    height:100%;
    min-width: 1024px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .content{
      box-shadow: 0 0 30px 0 #c3d3ea;
      border-radius: 4px;
      width:60%;
      min-width:900px;
      height:450px;
      margin-top: 80px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .contentLeft{
        height:100%;
        border-right:0.5px solid rgba(119, 175, 253,0.3);
        object-fit: cover;
        img{
          width:100%;
          height:100%;
          // margin-left: 150px;
        }
      }
      .contentRight{
        // margin-right: 20%;
        // flex:1;
        width: 50%;
        // height:100%;
        padding:0 40px;
        // border: 1px solid #eeeeee;
        // background: #EBF2F6;
        border-radius: 15px;
        // box-shadow: 0px 0px 5px 0px rgb(188 188 188 / 82%);
        .right{
          width:80%;
          // margin:0 auto;
          .right_title {
            width:100%;
            border-bottom: 2px solid  #eab308;
            color: #eab308;
            text-align: left;
            height: 60px;
            line-height: 60px;
            font-family: PingFangSC-Semibold;
            font-size: 20px;
            letter-spacing: 0;
            font-weight: 600;
            margin:20px 0;
          }
          .el-input {
            width:100%;
            margin:10px 0;
          }
          /deep/ .el-input__inner:focus{
            border-color: #eab308;
          }
          /deep/ .loginBtn .btn_submit {
            width: 100%;
            height: 48px;
            cursor: pointer;
            background-color:  #eab308;
            // border-radius: 15px;
            border-color: #eab308;
            font-size: 20px;
            margin: 40px 0;
          }
        }
      }
    }
  }

  @{deep} .el-form-item {
    margin-bottom: 0px;
  }
}

</style>
