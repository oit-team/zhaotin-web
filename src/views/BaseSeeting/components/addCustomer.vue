<template>
  <div class="ml-48" id="addMenu">
    <div class="headerBox">
      <el-backtop
        target="#addMenu"
        :visibility-height="200"
        :right="70"
        :bottom="100"
      />

      <el-page-header
        @back="$router.back()"
        :content="title"
      />
      <div class="text-center">
         <el-button
          size="small"
          icon="el-icon-check"
          type="primary"
          v-if="!justRead"
          @click="submitForm('customerForm')"
          >保存</el-button
        >
        <el-button
          size="small"
          icon="el-icon-refresh"
          v-if="!editFlag"
          @click="resetForm('customerForm')"
          >重置</el-button
        >
      </div>
    </div>

    <el-divider />

    <el-form
      style="margin-top: 20px"
      :model="customerForm"
      :rules="rules"
      ref="customerForm"
      label-width="90px"
      :label-position="labelPosition"
    >

      <div class="flex">

        <div class="left">
           <el-form-item label="登录账号" label-width="100%" prop="loginName">
            <el-input
             :disabled="editFlag"
              v-model="customerForm.loginName"
              style="width: 100%"
              placeholder="请输入登录账号"
            >
              <template slot="prepend" v-if="!editFlag">C</template>
            </el-input>
          </el-form-item>

           <el-form-item label="用户密码" label-width="100%" prop="passWord">
            <el-input
              type="password"
              autocomplete="new-password"
              v-model="customerForm.passWord"
              style="width: 100%"
              @input="$forceUpdate()"
              placeholder="请输入用户密码"
            />
              <div v-if="editFlag" class="pwdTip"><i class="el-icon-magic-stick" style="font-size:16px;margin-right:6px;color:#e60012;"></i>若要修改请直接输入新密码保存即可</div>
              <div v-else class="pwdTip"><i class="el-icon-magic-stick" style="font-size:16px;margin-right:0px;color:#e60012;"></i>不填则为默认密码</div>
          </el-form-item>

          <el-form-item label="客户名称" label-width="100%" prop="customerName">
            <el-input
              v-model="customerForm.customerName"
              style="width: 100%"
              placeholder="请输入客户名称"
            />
          </el-form-item>
          <el-form-item label="真实姓名" label-width="100%" prop="realName">
            <el-input
              v-model="customerForm.realName"
              style="width: 100%"
              placeholder="请输入真实姓名"
            />
          </el-form-item>
          <el-form-item label="入驻日期" label-width="100%" prop="enterTime">
            <el-date-picker
              v-model="customerForm.enterTime"
              style="width: 100%"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            />
          </el-form-item>
          <el-form-item label="联系人及联系方式" label-width="100%" prop="contactData">
            <el-input
              type="textarea"
              placeholder="请输入联系人及联系方式"
              style="width: 100%"
              v-model="customerForm.contactData"
              :height="'280px'"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="大区选择" label-width="100%" prop="orgName">
            <el-select
              v-model="orgName"
              placeholder="请选择您所在的大区"
              @change="changeOrg"
              style="width: 100%"
              value-key="osName"
            >
              <el-option
                v-for="item in OrgList"
                :key="item.osName"
                :label="item.osName"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="所属省：" label-width="100%" prop="provinces">
            <el-select
              v-model="provinces"
              placeholder="请选择您所在的省份"
              style="width: 100%"
              @change="changeProvince"
              value-key="code"
            >
              <el-option
                v-for="item in areaList"
                :key="item.code"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属市" label-width="100%" prop="city">
            <el-select
              v-model="city"
              style="width: 100%"
              placeholder="请选择您所在的城市"
              @change="changeCity"
              value-key="code"
            >
              <el-option
                v-for="item in cityList"
                :key="item.code"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属县" label-width="100%" prop="region">
            <el-select
              @change="changeRegion"
              v-model="customerForm.region"
              style="width: 100%"
              placeholder="请选择您所在的区县"
            >
              <el-option
                v-for="item in regionList"
                :key="item.code"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="地址" label-width="100%" prop="customerAddress">
            <el-input
              v-model="customerForm.customerAddress"
              style="width: 100%"
              placeholder="请输入地址"
            />
          </el-form-item>
        </div>
          <el-divider direction="vertical" />
           <div class="right">
        <el-form-item label="客户吊牌/吊牌价" label-width="100%" prop="tagPrice">
            <el-input
              v-model="customerForm.tagPrice"
              style="width: 100%"
              placeholder="请输入客户吊牌/吊牌价"
            />
          </el-form-item>

          <el-form-item label="客户洗唛" label-width="100%" prop="customerWashing">
            <el-input
              v-model="customerForm.customerWashing"
              style="width: 100%"
              placeholder="请输入客户洗唛"
            />
          </el-form-item>

            <el-form-item label="客户商标" label-width="100%">
        <vc-upload v-bind="uploadOptionimg"  ref="uploadImage">
          <i class="el-icon-plus"></i>
        </vc-upload>
        <p class="tip">*最多可以上传1张图片，推荐格式jpg或png</p>
       </el-form-item>
<!--        <el-form-item v-if="cateGoryVisibilty" label-width="100%" label="客户商标">
          <span class="flex text-base text-red-500">*该图片仅作展示，如需修改类别图片重新上 &nbsp; 传即可</span>
          <div class="w-24 h-24 mb-12">
            <el-image :src="customerForm.trademark" fit="cover" />
          </div>
       </el-form-item> -->

          <el-form-item label="客户洗唛车法" label-width="100%" prop="washingLabel">
            <el-input
              v-model="customerForm.washingLabel"
              style="width: 100%"
              placeholder="请输入客户洗唛车法"
            />
          </el-form-item>

           <el-form-item label="推荐人" label-width="100%" prop="refereesName">
            <el-select
              @change="changeRefereesName"
              v-model="customerForm.refereesName"
              style="width: 100%"
              placeholder="请选择推荐人"
            >
              <el-option
                v-for="item in refereesList"
                :key="item.id"
                :label="item.realName+'('+item.loginName+')'"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="跟单人员" label-width="100%" prop="documentaryName">
            <el-select
              @change="changeDocumentary"
              v-model="customerForm.documentaryName"
              style="width: 100%"
              placeholder="请选择跟单人员"
            >
              <el-option
                v-for="item in documentaryList"
                :key="item.id"
                :label="item.documentaryName"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="市场人员" label-width="100%" prop="marketName">
            <el-select
              @change="changeMarket"
              v-model="customerForm.marketName"
              style="width: 100%"
              placeholder="请选择市场人员"
            >
              <el-option
                v-for="item in marketList"
                :key="item.id"
                :label="item.marketName"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="客户经理" label-width="100%" prop="documentaryName">
            <el-select
              @change="changeManager"
              v-model="customerForm.managerName"
              style="width: 100%"
              placeholder="请选择客户经理"
            >
              <el-option
                v-for="item in managerList"
                :key="item.id"
                :label="item.managerName"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-collapse v-model="activeNames">
            <el-collapse-item title="详细备注" name="1">
              <el-form-item label="装箱注意事项" label-width="100%" prop="matters">
               <el-input
                 type="textarea"
                 placeholder="请输入装箱注意事项"
                 style="width: 100%"
                 v-model="customerForm.matters"
                 :height="'280px'"
               >
               </el-input>
          </el-form-item>

          <el-form-item label="发货明细表格要求" label-width="100%" prop="deliveryDetails">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              style="width: 100%"
              v-model="customerForm.deliveryDetails"
              :height="'280px'"
            >
            </el-input>
          </el-form-item>

            </el-collapse-item>
          </el-collapse>

          <el-form-item label="快递方式" prop="courier" label-width="100%" class="mt-4">
            <el-input
              v-model="customerForm.courier"
              style="width: 100%"
              placeholder="请输入快递方式"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import { getCustomer, addCustomer, changeCustomer } from "@/api/customer";
import {getTreeOrgListAll} from '@/api/org'
import CryptoJS from '@/assets/js/js/CryptoJS'
import quill from "@/views/common/quillEditor";
import VcUpload from "@/views/common/Upload";
import axios from "axios";
export default {
  name: "AddMenu",
  components: { quill, VcUpload },
  data() {
    return {
      fileList: [],
      title: '新增客户',
      justRead: false, //仅查看
      orgName: "", // 所属大区
      provinces: "",
      city: "",
      cateGoryVisibilty:false,
      // imgUrl:'',
      activeNames:['1'],
      uploadList: '',
      peopleList: [],
      refereesList:[], // 推荐人列表
      documentaryList: [], // 跟单人员列表
      marketList: [], // 市场人员列表
      managerList: [],
      areaList: [], // 全部区域列表
      provinceList: [], // 省
      cityList: [], // 城市列表
      regionList: [], // 县
      OrgList: [], // 区域列表
      collapse: ["1"],
      editFlag: false, // 是否是编辑菜单   false 新增  true 编辑
      userId: 1, // 即createdId
      pId: "", // 父菜单id   新增菜单时不选父菜单则默认为一级菜单，pId 传 "0"
      labelPosition: "left",
      pMenu: {},

      menuOption: [],
      checked: false, // 是否新增根菜单
      customerForm: {
        passWord:"",
        enterTime: "", // 入驻日期
        loginName: "", // 登录账号
        orgName: "", // 所属大区
        provinces: "",
        city: "",
        region: "",
        realName: "",
        customerName: "", // 客户名称
        contactData: "", // 联系人及联系方式
        customerAddress: "",
        customerType: 0,
        tagPrice: "", // 吊牌价
        customerWashing: "", // 客户洗唛
        trademark: "", // 客户商标
        washingLabel: "", // 客户洗唛车法
        matters: "", // 装箱注意事项
        courier: "", // 发货明细要求
        deliveryDetails: "", // 快递方式
        documentaryName: "", // 跟单人员
        documentaryId: "",
        marketName: "", // 市场人员
        marketId: "",
        managerName: "", // 客户经理
        managerId: "",
        id: "", // 客户id
        refereesName:'',
        refereesId: "", // 推荐人ID
        loginId: "",
      },
      rules: {
        customerName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        enterTime: [{ required: true, message: "请选择入驻日期", trigger: "blur" }],
        loginName: [
          { required: true, message: "请填写联系人姓名", trigger: "blur" },
        ],
        customerAddress: [
          { required: false, message: "请输入联系地址", trigger: "blur" },
        ],
        customerType: [
          { required: true, message: "请选择客户类型", trigger: "blur" },
        ],
        orgName: [{ required: true, message: "请选择大区", trigger: "blur" }],
        provinces: [{ required: true, message: "请选择省份", trigger: "blur" }],
        city: [{ required: false, message: "请选择城市", trigger: "blur" }],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        documentaryName: [{ required: false, message: "请选择跟单人员", trigger: "blur" }],
        marketName: [{ required: false, message: "请选择市场人员", trigger: "blur" }],
        managerName: [{ required: false, message: "请选择客户经理", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getCustomerList();
    this.getCityList();
    this.getTreeOrgList();
    this.customerForm.passWord = ''
    this.customerForm.loginName = ''
    if (this.$route.query.item) {
      this.imgVisible = true
      this.editFlag = true;
      this.title = '编辑客户'
      this.cateGoryVisibilty = true
      this.customerForm = this.$route.query.item.row;
      this.customerForm.trademark = this.$route.query.item.row.trademark
      this.customerForm.passWord = ''
      this.orgName = this.$route.query.item.row.orgName
      this.provinces = this.$route.query.item.row.provinces
      this.city = this.$route.query.item.row.city
      if (this.customerForm.trademark) {
        this.fileList = [{
          url:this.customerForm.trademark
        }]
      } else {
        this.fileList = []
      }
    }
    if (this.$route.query.flag) {
      this.justRead = true
      this.title = '查看客户'
    }
  },
  computed: {
    // 上传商标
    uploadOptionimg() {
      return {
        showFileList: true,
        multiple: true,
        typeOption: {
          "image/*": {
            data: {
              fileType: 0,
            },
          },
        },
        fileList: this.fileList,
        listType: "picture-card",
        maxSize: 1024 * 20,
        limit: 1,
        chunkSize: 1024 * 5,
        check: true,
        accept: "image/*",
        onSuccess: (file, fileList) => {
          this.uploadList = fileList
          this.customerForm.trademark = this.uploadList.response.data.fileUrl
        }
      };
    },
  },
  methods: {
    // onRemove(file) {
    //   this.customerForm.trademark = ''
    // },
    // 获取区域数据
    async getCityList() {
      const res = await axios.get(
        "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json"
      );
      this.areaList = res.data;
      this.areaList.forEach((item) => {
        if (item.level === 0) {
          this.provinceList.push({
            code: item.code,
            name: item.name,
            children: item.areaList,
          });
        }
      });
    },
    async getCustomerList() {
      // 获取送单人员
      const res = await getCustomer({
        pageNum: "1",
        pageSize: "999",
        code: "2",
        brandId:sessionStorage.brandId,
        userId: sessionStorage.userId,
      });
      this.peopleList = res.body.resultList;
      this.peopleList.forEach((item) => {
        this.documentaryList.push({
          documentaryId: item.id,
          documentaryName: item.nickName,
          id: item.id,
        });
        this.marketList.push({
          marketId: item.id,
          marketName: item.nickName,
          id: item.id,
        });
        this.managerList.push({
          managerId: item.id,
          managerName: item.nickName,
          id: item.id,
        });
        // console.log(item)
        // this.customerForm.refereesId = item.refereesId;
      });
      // 获取推荐人
      const response = await getCustomer({
        pageNum: "1",
        pageSize: "999",
        code: "1",
      }).then((res) => {
        if(res.head.status === 0) {
          this.refereesList = res.body.resultList
        }
        //
      })
    },
    // 选中推荐人
    changeRefereesName(val) {
      // console.log(val);
      this.customerForm.refereesName = val.realName+'('+val.loginName+')'
      this.customerForm.refereesId = val.id
    },
    changeDocumentary(val) {
      this.customerForm.documentaryId = val.documentaryId;
      this.customerForm.documentaryName = val.documentaryName;
    },
    // 市场人员id
    changeMarket(val) {
      this.customerForm.marketId = val.marketId;
      this.customerForm.marketName = val.marketName;
    },
    changeManager(val) {
      this.customerForm.managerId = val.managerId;
      this.customerForm.managerName = val.managerName;
    },
    // 获取区域下拉列表数据
    async getTreeOrgList() {
      await getTreeOrgListAll({ brandId: sessionStorage.brandId }).then((res) => {
        this.OrgList = res.body.resultMap;
      });
    },
    // 修改入参的区域数据
    changeOrg(val) {
      this.customerForm.orgName = val.osName;
      this.customerForm.orgStId = val.id;
    },
    // 选择省
    changeProvince(val) {
      this.customerForm.provinces = val.name;
      this.cityList = val.areaList;
    },
    // 选择市
    changeCity(val) {
      this.customerForm.city = val.name;
      this.regionList = val.areaList;
    },
    changeRegion(val) {
      // this.customerForm.region = val.name
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const encryPwd = this.customerForm.passWord.length > 0 ? CryptoJS.encrypt(this.customerForm.passWord) : ''
          if (this.editFlag) {
            // 编辑客户
            changeCustomer({
              code: "1",
              customerState: 0,
              customerIntegral: 0,
              refereesName: "daoru",
              refereesType: null,
              ...this.customerForm,
              passWord: encryPwd,
              loginId: this.customerForm.logId,
              trademark:this.customerForm.trademark
            })
              .then((res) => {
                if (res.head.status === 0) {
                  this.$message({
                    message: "编辑客户成功",
                    type: "success",
                  });
                  this.$router.back();
                } else {
                  this.$message({
                    message: res.head.msg,
                    type: "warning",
                  });
                }
              })
              .catch(() => {});
          } else {
            // 新增
            this.customerForm.loginName = `C${this.customerForm.loginName}`
            addCustomer({
              code: "1",
              customerState: 0,
              customerIntegral: 0,
              refereesType: null,
              ...this.customerForm,
              passWord: encryPwd,
              trademark:this.customerForm.trademark
            })
              .then((res) => {
                this.editFlag = false;
                if (res.head.status === 0) {
                  this.$message({
                    message: "新增客户成功",
                    type: "success",
                  });
                  this.$router.back();
                } else {
                  this.$message({
                    message: res.head.msg,
                    type: "warning",
                  });
                }
                this.getTreeMenuList();
              })
              .catch(() => {});
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 联系人及其联系方式
    changeWashContactDate(val) {
      this.customerForm.contactData = val
    },
    // 装箱
    changeWashMatters(val) {
      // console.log(val);
      this.customerForm.matters = val
    },
    // 发货注意事项
    changeWashDeliveryDetails(val) {
      this.customerForm.deliveryDetails = val
    },
  },
};
</script>

<style lang="less" scoped>
#addMenu {
  overflow: auto;
  margin-left: 100px;
}
/deep/ .el-form-item__label {
  padding: 0 0;
}
/deep/ .el-form-item__label {
  margin-right: 40px;
}
/deep/.el-collapse-item__header {
  border-top: 1px solid #ebeef5;
}
/deep/.el-divider--vertical {
  display: inline-block;
    width: 1px;
    height: auto;
    margin: 0 8px;
    vertical-align: middle;
    position: relative;
    margin-right: 80px;
}
.left {
  width: 50%;
  min-width:450px;
}
.right {
  width: 50%;
  min-width:450px;
}
/deep/.text-center {
  float:right;
}
/deep/ .el-textarea__inner {
  height: 100px;
}
/deep/ .el-form-item__content {
  margin-left:20px!important;
}
.pwdTip {
  margin-left: 40px;
}
/deep/.el-page-header{
  float:left;
}
/deep/.el-page-header__content{
  font-size:14px!important;
  font-weight: 500!important;
}
.headerBox{
  overflow:hidden;
}
.tip{
  color:#e60012;
  margin:12px 0px;
}
/deep/ .el-upload-list__item {
  transition: none !important;
}
</style>
