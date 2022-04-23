<template>
  <div class="ml-56" id="addRole">
    <el-page-header @back="$router.back()" :content="editFlag?'新增角色':'编辑角色'" />
    <el-divider />
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName" style="width:60%;" maxlength="10" placeholder="请选择角色名称" />
      </el-form-item>
      <!-- <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="ruleForm.roleCode" style="width:60%;" placeholder="请选择角色编码" />
      </el-form-item> -->
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
          default-expand-all
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
import { addRole, setRole } from '@/api/user'
import { getTreeMenuList } from '@/api/product'

export default {
  name: 'AddRole',
  data() {
    return {
      menuIds: [], // 权限菜单点击选中的menuId数组
      editFlag: true, // 判断是否出现重置
      menuList: [], // 树形菜单列表
      title: '',
      brandId: 0,
      ruleForm: {
        roleName: '',
        // roleCode: '',
        roleRemark: '',
      },
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
      menulist: [],
      defaultProps: {
        children: 'childrenMenu',
        label: 'menuName',
      },
    }
  },
  created() {
    // console.log(this.$route.query.item.row)
    if (this.$route.query.item) {
      this.title = '编辑'
      this.editFlag = false
      this.power()// 获取此角色菜单列表
      this.ruleForm = this.$route.query.item.row
    //   this.menuIds = '1'
    } else {
      this.title = '新增'
      this.editFlag = true
      this.getHomeMenuList()// 获取菜单树
    }
  },
  methods: {
    // 获取菜单树
    getHomeMenuList() {
      const con = {
        roleId: '',
        userId: '2', // 这个userId传死值“0”，为了兼容首页左侧菜单必须要有的
        isShowMenu: '0',
      }
      getTreeMenuList(con).then((res) => {
        this.menuList = res.body.resultList
        // 循环拿取菜单树第一层id
        const treeFirst = []
        // const menuIds = []
        for (let i = 0; i < this.menulist.length; i++) {
          treeFirst.push(this.menulist[i].menuId)
        }
        //   默认展开的节点
        this.defaultExpandedKeys = treeFirst
      })
    },
    // 获取此角色菜单列表
    power() {
      const _this = this
      const con = {
        userId: '0', // 这个userId传死值“0”，为了兼容首页左侧菜单必须要有的
        roleId: this.$route.query.item.row.roleId,
        isShowMenu: '0',
      }
      getTreeMenuList(con).then((res) => {
        // console.log('获取此角色所拥有的菜单id列表-----', res.data.body)
        if (res.head.status === 0) {
        //   console.log(res.body)
          _this.defaultCheckedKeys = res.body.menuIdList// 此角色的菜单menuIds
          this.getHomeMenuList()// 获取菜单树
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    // 保存
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys() // 半选中的节点所组成的数组
          const checkedKeys = this.$refs.tree.getCheckedKeys() // 选中的节点所组成的数组
          //   console.log(halfCheckedKeys, checkedKeys)
          for (let j = 0; j < halfCheckedKeys.length; j++) {
            checkedKeys.push(halfCheckedKeys[j])
          }
          //   console.log(halfCheckedKeys,checkedKeys)
          // console.log(checkedKeys.toString())
          _this.menuIds = checkedKeys
          //   console.log(this.menuIds)
          // console.log('_this.ruleForm.roleId',_this.ruleForm.roleId)
          //   if (_this.ruleForm.roleId === 0 || _this.ruleForm.roleId) {
          // console.log("编辑用户",_this.ruleForm.roleId)
          const con = {
            roleName: this.ruleForm.roleName,
            roleCode: this.ruleForm.roleCode,
            roleRemark: this.ruleForm.roleRemark,
            userId: sessionStorage.userId,
            brandId: sessionStorage.brandId,
            loginId:'1',
            // userId: '476',
            // brandId: '1',
            roleId: this.ruleForm.roleId,
            // brandId:this.ruleForm.brandId?this.ruleForm.brandId:"0",
            menuIds: this.menuIds.toString(),
          }
          // console.log(this.ruleForm)
          if (!this.ruleForm.roleId) {
            //   新增用户
            addRole(con).then((res) => {
              if (res.head.status === 0) {
                _this.$message({
                  message: res.head.msg,
                  type: 'success',
                })
                this.$router.back()
                //   _this.$bus.$emit('detailShow', _this.ruleForm) // 事件分发
              } else {
                _this.$message({
                  message: res.head.msg,
                  type: 'warning',
                })
              }
            })
            // 编辑用户
          } else {
            setRole({
              roleName: this.ruleForm.roleName,
              roleCode: this.ruleForm.roleCode,
              roleRemark: this.ruleForm.roleRemark,
              userId: sessionStorage.userId,
              roleId: this.ruleForm.roleId,
              brandId: sessionStorage.brandId,
              menuIds: this.menuIds.toString(),
            }).then(() => {
            //   console.log(res)
              this.$router.back()
              this.$message({
                message: '编辑成功',
                type: 'success',
              })
            })
          }
        }
      })
    },
  },
}
</script>

<style>

</style>
