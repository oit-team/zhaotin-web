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

<style lang="scss" scoped>
  // @import "../../assets/css/login";
</style>
