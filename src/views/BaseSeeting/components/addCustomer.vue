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
    >
 <el-tabs v-model="activeName">
    <el-tab-pane label="基本信息" name="1">

    <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="ruleForm.customerName" style="width:60%" placeholder="请输入客户名称" />
    </el-form-item>
     <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="ruleForm.realName" style="width:60%" placeholder="请输入真实姓名" />
    </el-form-item>
    <el-form-item label="联系人" prop="contactPerson">
        <el-input v-model="ruleForm.contactPerson" style="width:60%;" placeholder="请输入联系人" />
    </el-form-item>
    <el-form-item label="联系电话" prop="contactNumber">
      <el-input v-model="ruleForm.contactNumber" style="width:60%;" placeholder="请输入联系电话" />
    </el-form-item>
    <el-form-item label="大区选择" prop="orgName">
        <el-select
          v-model="ruleForm.orgName"
          placeholder="请选择您所在的大区"
          @change="changeOrg"
          style="width:60%;"
        >
          <el-option v-for="item in OrgList" :key="item.osName" :label="item.osName" :value="item.osName" />
        </el-select>
    </el-form-item>

    <el-form-item label="所属省：" prop="provinces">
      <el-select v-model="ruleForm.provinces" placeholder="请选择您所在的省份"  style="width:60%;" @change="changeProvince">
        <el-option
          v-for="item in areaList"
          :key="item.code"
          :label="item.name"
          :value="item">
        </el-option>
    </el-select>
    </el-form-item>

    <el-form-item label="所属市" prop="city">
      <el-select v-model="ruleForm.city" style="width:60%;"
                 placeholder="请选择您所在的城市"
                 @change="changeCity">
        <el-option
          v-for="item in cityList"
          :key="item.code"
          :label="item.name"
          :value="item">
        </el-option>
    </el-select>
    </el-form-item>

    <el-form-item label="所属县" prop="region">
      <el-select  @change="changeRegion" v-model="ruleForm.region" style="width:60%;" placeholder="请选择您所在的区县">
        <el-option
          v-for="item in regionList"
          :key="item.code"
          :label="item.name"
          :value="item.name">
        </el-option>
    </el-select>
    </el-form-item>

    <el-form-item label="地址" prop="customerAddress">
      <el-input v-model="ruleForm.customerAddress" style="width:60%;" placeholder="请输入地址" />
    </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="详细信息" name="2">
       <el-form-item label="客户吊牌/吊牌价" prop="tagPrice">
        <el-input v-model="ruleForm.tagPrice" style="width:60%" placeholder="请输入客户吊牌/吊牌价" />
    </el-form-item>

       <el-form-item label="客户洗唛" prop="customerWashing">
        <el-input v-model="ruleForm.customerWashing" style="width:60%" placeholder="请输入客户洗唛" />
    </el-form-item>

       <el-form-item label="客户商标" prop="trademark">
        <el-input v-model="ruleForm.trademark" style="width:60%" placeholder="请上传客户商标" />
    </el-form-item>

       <el-form-item label="客户洗唛车法" prop="washingLabel">
        <el-input v-model="ruleForm.washingLabel" style="width:60%" placeholder="请输入客户洗唛车法" />
    </el-form-item>

        <el-form-item label="跟单人员" prop="documentaryName">
      <el-select @change="changeDocumentary" v-model="ruleForm.documentaryName" style="width:60%;" placeholder="请选择跟单人员">
        <el-option
          v-for="item in documentaryList"
          :key="item.id"
          :label="item.documentaryName"
          :value="item">
        </el-option>
       </el-select>
    </el-form-item>

  <el-form-item label="市场人员" prop="marketName">
      <el-select @change="changeMarket" v-model="ruleForm.marketName" style="width:60%;" placeholder="请选择市场人员">
        <el-option
          v-for="item in marketList"
          :key="item.id"
          :label="item.marketName"
          :value="item">
        </el-option>
       </el-select>
    </el-form-item>

      <el-form-item label="客户经理" prop="documentaryName">
      <el-select @change="changeManager" v-model="ruleForm.managerName" style="width:60%;" placeholder="请选择客户经理">
        <el-option
          v-for="item in managerList"
          :key="item.id"
          :label="item.managerName"
          :value="item">
        </el-option>
       </el-select>
    </el-form-item>

       <el-form-item label="装箱注意事项" prop="matters">
           <quill
            class="quill"
            style="width:60%;"
            :value="ruleForm.matters"
            :editor-setting="editorSetting"
            :height="&quot;150px&quot;"
            @changeVal="changeWashMatters"
            />
    </el-form-item>
       <el-form-item label="发货明细表格要求" prop="deliveryDetails" class="mt-20">
         <quill
            class="quill"
            style="width:60%;"
            :value="ruleForm.deliveryDetails"
            :editor-setting="editorSetting"
            :height="&quot;150px&quot;"
            @changeVal="changeWashDeliveryDetails"
            />
    </el-form-item>
      <el-form-item label="快递方式" prop="courier" class="mt-20">
        <el-input v-model="ruleForm.courier" style="width:60%" placeholder="请输入快递方式" />
    </el-form-item>


    </el-tab-pane>
  </el-tabs>
   <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" v-if="!editFlag" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getCustomer, addCustomer, changeCustomer } from '@/api/customer'
import quill from '@/views/common/quillEditor'
import {getTreeOrgList} from '@/api/org'
import axios from 'axios'
export default {
  name: 'AddMenu',
  components: {quill},
  data() {
    return {
      peopleList:[],
      documentaryList:[], // 跟单人员列表
      marketList:[], // 市场人员列表
      managerList:[],
      areaList:[], // 全部区域列表
      provinceList:[], // 省
      cityList:[], // 城市列表
      regionList:[], // 县
      OrgList:[], // 区域列表
      activeName:'1', // tab页切换
      editFlag: false, // 是否是编辑菜单   false 新增  true 编辑
      userId: 1, // 即createdId
      pId: '', // 父菜单id   新增菜单时不选父菜单则默认为一级菜单，pId 传 "0"
      labelPosition: 'left',
      pMenu: {},

      menuOption: [],
      checked: false, // 是否新增根菜单
      editorSetting: [ // 文本编辑器
        ['bold', 'italic'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
      ],
      ruleForm: {
        orgName:'', // 所属大区
        provinces:'', 
        city:'',
        region:'',
        realName:'',
        customerName: '', // 客户名称
        contactPerson: '',
        contactNumber: null,
        customerAddress: '',
        realName: '',
        customerType: 0,
        tagPrice:'', // 吊牌价
        customerWashing:'', // 客户洗唛
        trademark:'', // 客户商标
        washingLabel:'', // 客户洗唛车法
        matters:'', // 装箱注意事项
        courier:'', // 发货明细要求
        deliveryDetails:'', // 快递方式
        documentaryName:'', // 跟单人员
        documentaryId:'',
        marketName:'', // 市场人员
        marketId:'',
        managerName:'', // 客户经理
        managerId:'',
        id: '', // 客户id
        refereesId:'', // 推荐人ID
        loginId: '',
      },
      rules: {
        customerName: [
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
         orgName: [
          { required: true, message: '请选择大区', trigger: 'blur' },
        ],
         provinces: [
          { required: true, message: '请选择省份', trigger: 'blur' },
        ],
         city: [
          { required: true, message: '请选择城市', trigger: 'blur' },
        ],
         region: [
          { required: true, message: '请选择区县', trigger: 'blur' },
        ],
         realName: [
          { required: true, message: '请选择客户类型', trigger: 'blur' },
        ],
      },

    }
  },
  created() {
    this.getCustomerList()
    this.getCityList()
    this.getTreeOrgList()
    if (this.$route.query.item) {
      // console.log(this.$route.query.item.row);
      this.editFlag = true
      this.ruleForm = this.$route.query.item.row
      // this.ruleForm.realName = this.$route.query.item.row.realName
      // this.ruleForm.contactPerson = this.$route.query.item.row.contactPerson
      this.ruleForm.contactNumber = Number(this.$route.query.item.row.contactNumber)
      this.ruleForm.orgName = this.$route.query.item.row.orgName
      // this.ruleForm.customerType = this.$route.query.item.row.customerType
      // this.ruleForm.id = this.$route.query.item.row.id.toString()
      // this.ruleForm.customerName = this.$route.query.item.row.customerName
      // this.ruleForm.loginId = this.$route.query.item.row.logId
    }
  },
  methods: {
    // 获取区域数据
   async getCityList() {
      const res = await axios.get(
         'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
       )
       this.areaList = res.data
       this.areaList.forEach(item => {
         if(item.level === 0) {
      this.provinceList.push({
            code: item.code,
            name: item.name,
            children: item.areaList
         })
         }
       })
},
  // 获取送单人员
 async getCustomerList() {
      const res = await getCustomer({
        pageNum: '1',
        pageSize: '999',
        code: '1',
        userId:sessionStorage.userId
      })
      this.peopleList = res.body.resultList
      this.peopleList.forEach(item => {
        this.documentaryList.push({
          documentaryId:item.documentaryId,
          documentaryName:item.documentaryName,
          id:item.id
        })
         this.marketList.push({
          marketId:item.marketId,
          marketName:item.marketName,
          id:item.id
        })
         this.managerList.push({
          managerId:item.managerId,
          managerName:item.managerName,
          id:item.id
        })
        this.ruleForm.refereesId = item.refereesId
      })
  },
  changeDocumentary(val) {
    console.log(val);
    this.ruleForm.documentaryId = val.documentaryId
    this.ruleForm.documentaryName = val.documentaryName
  },
  // 市场人员id
  changeMarket(val) {
    this.ruleForm.marketId = val.marketId
    this.ruleForm.marketName = val.marketName
  },
  changeManager(val) {
    this.ruleForm.managerId = val.managerId
    this.ruleForm.managerName = val.managerName
  },
    // 获取区域下拉列表数据
   async getTreeOrgList() {
     await getTreeOrgList({brandId:sessionStorage.brandId}).then((res) => {
      //  console.log(res);
      this.OrgList = res.body.resultMap
      })
    },
    // 修改入参的区域数据
    changeOrg(val) {
      this.ruleForm.orgName = val
    },
    // 改变省
    changeProvince(val) {
      this.ruleForm.provinces = val.name
      this.cityList = val.areaList
    },
    // 选择市
    changeCity(val) {
      this.ruleForm.city = val.name
      this.regionList = val.areaList
    },
    changeRegion(val) {
      // this.ruleForm.region = val.name
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editFlag) {
            // 编辑客户
            changeCustomer({ code: '1', ...this.ruleForm }).then((res) => {
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
          //   // 新增
            addCustomer({
              code: '1',
              customerState:0,
              updateTime:null,
              customerIntegral:null,
              refereesName:'daoru',
              refereesType:null,
              ...this.ruleForm,
              contactDate:null,
              contactNumber: Number(this.ruleForm.contactNumber),
            }).then((res) => {
              this.editFlag = false
              if (res.head.status === 0) {
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
            }).catch(() => {
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
     // 装箱
    changeWashMatters(val) {
      this.ruleForm.matters = val.replace(/<\/?.+?\/?>/g, '');
      // console.log(this.ruleForm.washMaintenance)
    },
    // 发货注意事项
    changeWashDeliveryDetails(val) {
      this.ruleForm.deliveryDetails = val.replace(/<\/?.+?\/?>/g, '');
    }
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
// /deep/ .el-input__inner {
//   margin-left: 40px;
// }
// /deep/ .quill {
//   margin-left: 40px;
// }
</style>
