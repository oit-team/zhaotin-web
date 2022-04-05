<template>
  <div class="ml-64" id="addRole">
    <el-page-header @back="goBack" :content="editFlag?'新增角色':'编辑角色'" />
    <el-divider />
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName" style="width:60%;" maxlength="10" placeholder="请选择角色名称" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="ruleForm.roleCode" style="width:60%;" placeholder="请选择角色编码" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleRemark">
        <el-input v-model="ruleForm.roleRemark" style="width:60%;" maxlength="32" placeholder="请输入角色描述" />
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-tree
          :data="menuList"
          ref="tree"
          node-key="menuId"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps"
          :show-checkbox="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" v-if="editFlag" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuIds: '',
      editFlag: true, // 判断是否出现重置
      menuList: '', // 树形菜单列表
      title: '',
      brandId: 0,
      ruleForm: {},
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2, max: 10, message: '长度在 2 到 10 个汉字', trigger: 'blur',
          },
        ],
        roleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
        ],
        roleRemark: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2, max: 32, message: '长度在 2 到 32 个汉字', trigger: 'blur',
          },
        ],
      },
      // 菜单
      roleIds: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      //   menuList: [],
      defaultProps: {
        children: 'childrenMenu',
        label: 'menuName',
      },
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
  },
}
</script>

<style>

</style>
