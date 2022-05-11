<template>
  <!-- 把角色赋予用户 -->
  <div class="ml-32" id="authUsersByRoleId">
    <el-page-header @back="goBack" :content="pageTitle" />
    <el-divider class="mt-20" />
    <!-- <div class="roleDesc">{{roleName}}--{{roleRemark}}</div> -->
    <el-transfer
      class="mt-24"
      filterable
      v-model="associatedUser"
      :data="allUserList"
      :props="{key:'id',label:'userName'}"
      :render-content="renderFunc"
      :titles="['未授权用户', '已授权用户']"
      :button-texts="['取消', '授权']"
      :left-default-checked="leftDefaultChecked"
      :right-default-checked="rightDefaultChecked"
      @left-check-change="leftChecked"
      @right-check-change="rightChecked"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { getRoleUserList, addUserAndRole } from '@/api/user'

export default {
  name: 'AuthUsersByRoleId',
  components: {},
  data() {
    return {
      roleId: null,
      roleName: '',
      roleRemark: '',
      allUserList: [],
      associatedUser: [], // 右侧数据，只用写key就好
      leftDefaultChecked: [],
      rightDefaultChecked: [],
      pageTitle: '用户角色授权',
    }
  },
  created() {
    // console.log(this.$route.query.item)
    if (this.$route.query.item) {
      this.roleId = this.$route.query.item.row.roleId
      this.roleName = this.$route.query.item.row.roleName
      this.roleRemark = this.$route.query.item.row.roleRemark
    } else {
      this.roleId = null
    }
    this.pageTitle = `${this.pageTitle}--${this.roleName}`
  },
  mounted() {
    this.getAllUsers()
  },
  activated() {

  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 获取用户列表
    getAllUsers() {
      const _this = this
      const con = {
        roleId: _this.roleId, // 角色IDquerystring
        brandId: sessionStorage.brandId, // 品牌IDquerystring
      }
      getRoleUserList(con).then((res) => {
        // console.log("获取用户列表==========",res.data.body);
        if (res.head.status === 0) {
          // console.log("获取用户列表成功===");
          _this.allUserList = res.body.allUser
          _this.associatedUser = res.body.isAssociatedUser
          console.log(_this.associatedUser)
        } else {
          _this.$message({
            message: res.head.msg,
            type: 'warning',
          })
        }
      }).catch(() => {
        // console.log(err)
      })
    },
    // 左侧点击事件
    leftChecked(item) {
     // console.log(item);
    },
    // 右侧点击事件
    rightChecked() {
      // console.log('右侧点击事件===')
    },
    handleChange(value, direction, movedKeys) {
      // console.log("----------------",value, direction, movedKeys);
      // value 右侧数组集合
      // direction 有right和left两个值 代表向左右两边传值
      // movedKeys 移动元素id组成的数组集合
      if (direction === 'right') {
        // console.log("点击'授权'按钮");
        this.empowerUsersByRoleId(movedKeys, 0)
      }
      if (direction === 'left') {
        // console.log("点击'取消'按钮");
        this.empowerUsersByRoleId(movedKeys, 1)
      }
    },
    // 授权
    empowerUsersByRoleId(userArr, operateId) {
      //this.checkedRoleArr = this.$refs.roleTree.getCheckedKeys();     // 选中的节点所组成的数组
      // console.log("选中的角色数组==",this.checkedRoleArr)
      const _this = this
      const con = {
        userIds: userArr.join(','), // 用户ID字符串
        roleIds: this.roleId, // 角色ID字符串
        operateId, // 0 新增  1 删除
      }
      //   const jsonParam = _this.GLOBAL.g_paramJson(con)
      addUserAndRole(con).then((res) => {
        // console.log("批量给用户进行角色授权===",res.data.body);
        if (res.data.head.status === 0) {
          _this.$message({
            message: '用户角色授权成功',
            type: 'success',
          })
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch(() => {
        // console.log(err)
      })
    },
    renderFunc(h, option) {
      // // console.log(h,option)
      if (option.nickName) {
        return <span>{ option.userName } - { option.nickName }</span>
      }
      return <span>{ option.userName }</span>
    },

  },
}
</script>

<style lang="less" scoped>
// #authUsersByRoleId{
//   height: 80vh;
//   width: 80vw;
//   .roleDesc{
//     line-height: 32px;
//     text-align: left;
//   }
// }
/deep/.el-transfer-panel {
  width: 380px;
  margin-left: 0;
}
</style>
