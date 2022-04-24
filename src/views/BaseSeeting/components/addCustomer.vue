<template>
  <div class="ml-48" id="addMenu">
    <el-backtop
      target="#addMenu"
      :visibility-height="200"
      :right="70"
      :bottom="100"
    />

    <el-page-header
      @back="$router.back()"
      :content="editFlag ? '编辑客户' : '新增客户'"
    />

    <el-divider />

    <el-form
      style="margin-top: 20px"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="90px"
      :label-position="labelPosition"
    >

      <div class="flex">

        <div class="left">
           <el-form-item label="登录账号" prop="loginName">
            <el-input
             :disabled="editFlag"
              v-model="ruleForm.loginName"
              style="width: 60%"
              placeholder="请输入登录账号"
            />
          </el-form-item>
          <el-form-item label="客户名称" prop="customerName">
            <el-input
              v-model="ruleForm.customerName"
              style="width: 60%"
              placeholder="请输入客户名称"
            />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input
              v-model="ruleForm.realName"
              style="width: 60%"
              placeholder="请输入真实姓名"
            />
          </el-form-item>
          <el-form-item label="入驻日期" prop="enterTime">
            <el-date-picker
              v-model="ruleForm.enterTime"
              style="width: 60%"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            />
          </el-form-item>
          <el-form-item label="大区选择" prop="orgName">
            <el-select
              v-model="ruleForm.orgName"
              placeholder="请选择您所在的大区"
              @change="changeOrg"
              style="width: 60%"
            >
              <el-option
                v-for="item in OrgList"
                :key="item.osName"
                :label="item.osName"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="所属省：" prop="provinces">
            <el-select
              v-model="ruleForm.provinces"
              placeholder="请选择您所在的省份"
              style="width: 60%"
              @change="changeProvince"
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

          <el-form-item label="所属市" prop="city">
            <el-select
              v-model="ruleForm.city"
              style="width: 60%"
              placeholder="请选择您所在的城市"
              @change="changeCity"
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

          <el-form-item label="所属县" prop="region">
            <el-select
              @change="changeRegion"
              v-model="ruleForm.region"
              style="width: 60%"
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

          <el-form-item label="地址" prop="customerAddress">
            <el-input
              v-model="ruleForm.customerAddress"
              style="width: 60%"
              placeholder="请输入地址"
            />
          </el-form-item>
        </div>
          <el-divider direction="vertical" />
           <div class="right">
        <el-form-item label="客户吊牌/吊牌价" prop="tagPrice">
            <el-input
              v-model="ruleForm.tagPrice"
              style="width: 60%"
              placeholder="请输入客户吊牌/吊牌价"
            />
          </el-form-item>

          <el-form-item label="客户洗唛" prop="customerWashing">
            <el-input
              v-model="ruleForm.customerWashing"
              style="width: 60%"
              placeholder="请输入客户洗唛"
            />
          </el-form-item>

          <el-form-item label="客户商标" prop="trademark">
            <vc-upload v-if="!editFlag" v-bind="uploadOptionimg" ref="uploadImage">
              <i class="el-icon-plus"></i>
            </vc-upload>
           <!-- <div v-if="uploadList.length" class="w-24 h-24 bg-blue-300"></div> -->
            <img v-else v-for="item in uploadList" :key="item" :src="item" alt="">
          </el-form-item>

          <el-form-item label="客户洗唛车法" prop="washingLabel">
            <el-input
              v-model="ruleForm.washingLabel"
              style="width: 60%"
              placeholder="请输入客户洗唛车法"
            />
          </el-form-item>

           <el-form-item label="推荐人" prop="refereesName">
            <el-select
              @change="changeRefereesName"
              v-model="ruleForm.refereesName"
              style="width: 60%"
              placeholder="请选择推荐人"
            >
              <el-option
                v-for="item in refereesList"
                :key="item.id"
                :label="item.realName"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="跟单人员" prop="documentaryName">
            <el-select
              @change="changeDocumentary"
              v-model="ruleForm.documentaryName"
              style="width: 60%"
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

          <el-form-item label="市场人员" prop="marketName">
            <el-select
              @change="changeMarket"
              v-model="ruleForm.marketName"
              style="width: 60%"
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

          <el-form-item label="客户经理" prop="documentaryName">
            <el-select
              @change="changeManager"
              v-model="ruleForm.managerName"
              style="width: 60%"
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
              <el-form-item label="装箱注意事项" prop="matters">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              style="width: 60%"
              :value="ruleForm.matters"
              :editor-setting="editorSetting"
              :height="'150px'"
              @changeVal="changeWashMatters"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="发货明细表格要求" prop="deliveryDetails">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              style="width: 60%"
              :value="ruleForm.deliveryDetails"
              :editor-setting="editorSetting"
              :height="'150px'"
              @changeVal="changeWashDeliveryDetails"
            >
            </el-input>
          </el-form-item>

           <el-form-item label="联系人及联系方式" prop="contactDate">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              style="width: 60%"
              :value="ruleForm.contactDate"
              :editor-setting="editorSetting"
              :height="'150px'"
              @changeVal="changeWashContactDate"
            >
            </el-input>
          </el-form-item>
            </el-collapse-item>
          </el-collapse>

          <el-form-item label="快递方式" prop="courier" class="mt-4">
            <el-input
              v-model="ruleForm.courier"
              style="width: 60%"
              placeholder="请输入快递方式"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
      <div class="text-center">
         <el-button
          size="small"
          icon="el-icon-check"
          type="primary"
          @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button
          size="small"
          icon="el-icon-refresh"
          v-if="!editFlag"
          @click="resetForm('ruleForm')"
          >重置</el-button
        >
      </div>
  </div>
</template>

<script>
import { getCustomer, addCustomer, changeCustomer } from "@/api/customer";
import quill from "@/views/common/quillEditor";
import VcUpload from "@/views/common/Upload";
import { getTreeOrgList } from "@/api/org";
import axios from "axios";
export default {
  name: "AddMenu",
  components: { quill, VcUpload },
  data() {
    return {
      activeNames:['1'],
      uploadList: [],
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
      editorSetting: [
        // 文本编辑器
        ["bold", "italic"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
      ruleForm: {
        enterTime : "", // 入驻日期
        loginName: "", // 登录账号
        orgName: "", // 所属大区
        provinces: "",
        city: "",
        region: "",
        realName: "",
        customerName: "", // 客户名称
        contactDate: "", // 联系人及联系方式
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
          { required: true, message: "请输入联系地址", trigger: "blur" },
        ],
        customerType: [
          { required: true, message: "请选择客户类型", trigger: "blur" },
        ],
        orgName: [{ required: true, message: "请选择大区", trigger: "blur" }],
        provinces: [{ required: true, message: "请选择省份", trigger: "blur" }],
        city: [{ required: true, message: "请选择城市", trigger: "blur" }],
        region: [{ required: true, message: "请选择区县", trigger: "blur" }],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        documentaryName: [{ required: true, message: "请选择跟单人员", trigger: "blur" }],
        marketName: [{ required: true, message: "请选择市场人员", trigger: "blur" }],
        managerName: [{ required: true, message: "请选择客户经理", trigger: "blur" }],
        refereesName: [{ required: true, message: "请选择推荐人", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getCustomerList();
    this.getCityList();
    this.getTreeOrgList();
    if (this.$route.query.item) {
      this.imgVisible = true
      console.log(this.$route.query.item.row);
      this.editFlag = true;
      this.ruleForm = this.$route.query.item.row;
      // this.ruleForm.documentaryName = this.$route.query.item.row.realName
      // this.ruleForm.marketName = this.$route.query.item.row.realName
      // this.ruleForm.managerName = this.$route.query.item.row.realName
      // this.ruleForm.loginName = this.$route.query.item.row.loginName
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
        listType: "picture-card",
        maxSize: 1024 * 20,
        limit: 6,
        chunkSize: 1024 * 5,
        check: true,
        accept: "image/*",
        onSuccess: (file, fileList) => {
          console.log(fileList);
          this.uploadList.push(fileList.response.data.fileUrl);
        },
      };
    },
  },
  methods: {
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
        // this.ruleForm.refereesId = item.refereesId;
      });
      // 获取推荐人
      const response = await getCustomer({
        pageNum: "1",
        pageSize: "999",
        code: "1",
      }).then((res) => {
        console.log(res);
        if(res.head.status === 0) {
          this.refereesList = res.body.resultList
        }
        // 
      })
    },
    // 选中推荐人
    changeRefereesName(val) {
      console.log(val);
      this.ruleForm.refereesName = val.realName
      this.ruleForm.refereesId = val.id
    },
    changeDocumentary(val) {
      this.ruleForm.documentaryId = val.documentaryId;
      this.ruleForm.documentaryName = val.documentaryName;
    },
    // 市场人员id
    changeMarket(val) {
      this.ruleForm.marketId = val.marketId;
      this.ruleForm.marketName = val.marketName;
    },
    changeManager(val) {
      this.ruleForm.managerId = val.managerId;
      this.ruleForm.managerName = val.managerName;
    },
    // 获取区域下拉列表数据
    async getTreeOrgList() {
      await getTreeOrgList({ brandId: sessionStorage.brandId }).then((res) => {
        this.OrgList = res.body.resultMap;
      });
    },
    // 修改入参的区域数据
    changeOrg(val) {
      console.log(val);
      this.ruleForm.orgName = val.osName;
      this.ruleForm.orgStId = val.id;
    },
    // 选择省
    changeProvince(val) {
      this.ruleForm.provinces = val.name;
      this.cityList = val.areaList;
    },
    // 选择市
    changeCity(val) {
      this.ruleForm.city = val.name;
      this.regionList = val.areaList;
    },
    changeRegion(val) {
      // this.ruleForm.region = val.name
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editFlag) {
            // 编辑客户
            changeCustomer({
              code: "1",
              customerState: 0,
              customerIntegral: 0,
              refereesName: "daoru",
              refereesType: null,
              ...this.ruleForm,
              loginId: this.ruleForm.logId,
            })
              .then((res) => {
                if (res.head.status === 0) {
                  this.$message({
                    message: "编辑菜单成功",
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
            //   // 新增
            addCustomer({
              code: "1",
              customerState: 0,
              customerIntegral: 0,
              refereesType: null,
              ...this.ruleForm,
            })
              .then((res) => {
                this.editFlag = false;
                if (res.head.status === 0) {
                  this.$message({
                    message: "新增菜单成功",
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
      this.ruleForm.contactDate = val.replace(/<\/?.+?\/?>/g, "");
    },
    // 装箱
    changeWashMatters(val) {
      this.ruleForm.matters = val.replace(/<\/?.+?\/?>/g, "");
    },
    // 发货注意事项
    changeWashDeliveryDetails(val) {
      this.ruleForm.deliveryDetails = val.replace(/<\/?.+?\/?>/g, "");
    },
  },
};
</script>

<style lang="less" scoped>
#addMenu {
  height: calc(100vh - 180px);
  overflow: auto;
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
  width: 450px;
}
.right {
  width: 450px;
}
/deep/.text-center {
  margin-left: -105px;
  margin-top: 20px;
}
</style>
