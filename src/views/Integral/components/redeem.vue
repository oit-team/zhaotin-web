<template>
  <div class="zt-page__order">
    <el-page-header content="积分兑换" @back="goBack" />
    <div class="zt-site__line">
      <div class="zt-site__title">
        确认收货地址
      </div>
      <div class="zt-site__add" @click="addSite">
        新增收货地址
      </div>
    </div>
    <div v-if="showEmp" class="zt-site">
      <el-empty :image-size="100" description="暂无地址信息" />
    </div>
    <div v-else class="zt-site">
      <div v-for="(item, index) in siteList" :key="index" class="zt-site__item" :class="radio === index ? 'site-item__select' : ''">
        <div v-if="radio === index" class="site-item__l">
          <i class="el-icon-location"></i>寄送至
        </div>
        <div class="zt-site__check">
          <el-radio v-model="radio" :label="index">
            <span class="site-radio">{{ item.address }} {{ " " }}({{ item.consignee }} 收){{ " " }}{{ item.contactNum }}</span>
          </el-radio>
          <span v-if="item.defaultNum === 1" class="defoSite">默认地址</span>
        </div>
        <div v-if="radio === index" class="site-item__r">
          <div class="site-item__d" @click="deleteSite">
            删除
          </div>
          <div class="site-item__c" @click="setSite">
            修改本地址
          </div>
        </div>
      </div>
    </div>
    <div class="zt-content">
      <!-- <div class="zt-content__item" v-for="(item, index) in formData.styleList" :key="index"> -->
      <div class="zt-content__item">
        <!-- 一级选择框 -->
        <!-- <div class="zt-cart__title">
          <div class="zt-title__title">{{ item.styleName }}</div>
        </div> -->
        <!-- <div class="zt-cart__line" v-for="(itemN, indexN) in item.style" :key="indexN"> -->
        <div class="zt-cart__line">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-image style="width: 100px; height: 100px" :src="formData.image" fit="contain" @click="todetails(item, item.styleId)" />
              <!-- </div> -->
            </el-col>
            <el-col :span="6">
              <div class="zt-cart__name">
                {{ formData.goodsName }}
              </div>
            </el-col>
            <el-col :span="8">
              <div class="zt-cart__color">
                商品编号：{{ formData.styleNo }}
              </div>
            </el-col>
            <el-col :span="6">
              <div>{{ formData.integralDesc }}</div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="flex items-end justify-between px-5 pb-5">
        <div>
          <!-- <div>数量：{{ formData.goodsNumber }}</div> -->
          <div>消费积分：{{ formData.goodsIntegral }}</div>
        </div>
        <div>
          <p>
            收货人：
            <span>{{ siteList[radio] ? siteList[radio].consignee : '无' }}</span>
            {{ ' ' }}{{ siteList[radio] ? siteList[radio].contactNum : '' }}
          </p>
          <p>寄送地址：<span>{{ siteList[radio] ? siteList[radio].address : '无' }}</span></p>
        </div>
      </div>
    </div>
    <div class="flex my-5">
      <div class="label w-24">
        订单备注：
      </div>
      <el-input v-model="orderNote" type="textarea" :rows="4" />
    </div>
    <div class="flex justify-between">
      <div></div>
      <div class="zt-footer__button" @click="subOrder('textForm')">
        确认兑换
      </div>
    </div>
    <el-drawer
      ref="drawer"
      title="新增收货地址"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      size="40%"
      custom-class="zt-demo__drawer"
    >
      <div class="demo-drawer__content">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          :label-position="labelPosition"
          :label-width="formLabelWidth"
          :hide-required-asterisk="false"
        >
          <el-form-item label="收货人" prop="name">
            <el-input v-model="ruleForm.name" placeholder="名字" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.number="ruleForm.phone" maxlength="11" placeholder="手机号 " />
          </el-form-item>
          <el-form-item label="详细地址" prop="siteInfo">
            <el-input v-model="ruleForm.siteInfo" type="textarea" placeholder="详细乡村/街道地址" />
          </el-form-item>
          <el-form-item label="设为默认收货地址" prop="isdef">
            <el-switch v-model="ruleForm.isdef" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">
            取 消
          </el-button>
          <el-button type="primary" :loading="loading" @click="subForm('ruleForm')">
            {{ loading ? "提交中 ..." : "确 定" }}
          </el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      ref="drawer2"
      title="修改收货地址"
      :before-close="handleClose2"
      :visible.sync="dialog2"
      direction="rtl"
      size="40%"
      custom-class="zt-demo__drawer"
    >
      <div class="demo-drawer__content">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          :label-position="labelPosition"
          :label-width="formLabelWidth"
          :hide-required-asterisk="false"
        >
          <el-form-item label="收货人" prop="name">
            <el-input v-model="ruleForm.name" placeholder="名字" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.number="ruleForm.phone" maxlength="11" placeholder="手机号 " />
          </el-form-item>
          <el-form-item label="详细地址" prop="siteInfo">
            <el-input v-model="ruleForm.siteInfo" type="textarea" placeholder="详细乡村/街道地址" />
          </el-form-item>
          <el-form-item label="设为默认收货地址" prop="isdef">
            <el-switch v-model="ruleForm.isdef" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm2">
            取 消
          </el-button>
          <el-button type="primary" :loading="loading" @click="subForm2('ruleForm')">
            {{ loading ? "提交中 ..." : "确 定" }}
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  addOrderSite,
  dltOrderSite,
  getOrderSite,
  setOrderSite,
  // CalculatePrice,
} from '@/api/orderCart'
import { addIntegralOrder, payIntegralOrder } from '@/api/integral'

export default {
  name: 'Redeem',
  data() {
    return {
      formData: {},
      formData2: {},
      siteList: {},
      showEmp: false,
      radio: 0,
      // --  添加地址表单  --
      showDr: false,
      showDr2: false,
      labelPosition: 'left',
      dialog: false,
      dialog2: false,
      timer: null,
      timer2: null,
      loading: false,
      loading2: false,
      formLabelWidth: '150px',
      ruleForm: {
        id: '',
        name: '',
        phone: '',
        siteInfo: '',
        isdef: false, // 是否设为默认地址
      },
      orderNote: '',
      rules: {
        name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^[1][3,4,5,6,7,8][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
        ],
        siteInfo: { required: true, message: '地址不能为空', trigger: 'blur' },
      },
      oldUrl: '',
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.oldUrl = from.path
    })
  },
  created() {
    this.getData()
    this.formData = this.$store.state.integral.orderStorage
  },
  beforeDestroy() {
    if (this.$route.path === '/styleCenter/goodsDetails')
      this.$store.commit('integral/cgStart', false)
    else
      this.$store.commit('integral/cgStart', true)
  },
  methods: {
    // 获取收货地址信息
    async getData() {
      const res = await getOrderSite({
        customerId: sessionStorage.getItem('userId'),
      })
      this.siteList = res.body.resultList
      if (this.siteList && this.siteList.length === 0)
        this.showEmp = true
      else
        this.showEmp = false
    },
    // 返回功能
    goBack() {
      this.$router.back()
      this.$store.commit('integral/cgStart', false)
    },
    // 新增地址
    addSite() {
      this.ruleForm = {
        id: '',
        name: '',
        phone: '',
        siteInfo: '',
        isdef: 0, // s是否设为默认地址
      }
      this.showDr = true
      this.dialog = true
    },
    // 修改地址
    setSite() {
      this.ruleForm = {
        id: this.siteList[this.radio].id,
        name: this.siteList[this.radio].consignee,
        phone: this.siteList[this.radio].contactNum,
        siteInfo: this.siteList[this.radio].address,
        isdef: this.siteList[this.radio].defaultNum === 1, // s是否设为默认地址
      }
      this.showDr2 = true
      this.dialog2 = true
    },
    // 删除地址
    deleteSite() {
      this.$confirm('确认删除该地址吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await dltOrderSite({
            receivingId: this.siteList[this.radio].id,
          })
          if (res.head.status === 0)
            this.$message.success('删除成功')
          else
            this.$message.warning('删除失败')

          this.getData()
        })
        .catch(() => {})
    },
    handleClose(done) {
      this.$confirm('确定要提交表单吗？')
        .then(() => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            // 动画关闭需要一定的时间
            this.subForm('ruleForm')
            setTimeout(() => {
              this.loading = false
            }, 400)
          }, 2000)
        })
        .catch(() => {})
    },
    handleClose2(done) {
      this.$confirm('确定要提交表单吗？')
        .then(() => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            this.subForm2('ruleForm')
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false
            }, 400)
          }, 2000)
        })
        .catch(() => {})
    },
    // 关闭 add  抽屉
    cancelForm() {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
    },
    // 关闭  set  抽屉
    cancelForm2() {
      this.loading2 = false
      this.dialog2 = false
      clearTimeout(this.timer)
    },
    // 点击提交 地址
    subForm(formName) {
      const isf = this.ruleForm.isdef ? 1 : 0
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await addOrderSite({
            consignee: this.ruleForm.name,
            contactNum: this.ruleForm.phone,
            address: this.ruleForm.siteInfo,
            customerId: sessionStorage.getItem('userId'),
            defaultNum: isf,
          })
          if (res.head.status === 0) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.getData()
          } else {
            this.$message.error(res.head.msg)
          }
          this.loading = false
          this.dialog = false
          clearTimeout(this.timer)
        } else {
          this.$message.warning('请填写正确信息')
          this.loading = false
          // this.dialog = false
          return false
        }
      })
    },
    // 点击提交 地址
    subForm2(formName) {
      const isf = this.ruleForm.isdef ? 1 : 0
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await setOrderSite({
            receivingId: this.ruleForm.id,
            consignee: this.ruleForm.name,
            contactNum: this.ruleForm.phone,
            address: this.ruleForm.siteInfo,
            customerId: sessionStorage.getItem('userId'),
            defaultNum: isf,
          })
          if (res.head.status === 0) {
            this.$message({
              message: '修改成功',
              type: 'success',
            })
            this.getData()
          } else {
            this.$message.error(res.head.msg)
          }
          this.loading2 = false
          this.dialog2 = false
          clearTimeout(this.timer)
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    subOrder() {
      const con = {
        orderUser: this.$store.state.userinfo.id,
        receivingId: this.siteList[this.radio].id,
        goodsId: this.formData.goodsId,
        goodsNumber: this.formData.goodsNumber,
        goodsNo: this.formData.styleNo,
        goodsIntegral: this.formData.goodsIntegral,
        orderRemarks: this.orderNote,
      }
      addIntegralOrder(con).then((res) => {
        if (res.head.status === 0) {
          this.$message.success('兑换成功')
          this.$store.commit('integral/cgStart', true)
          payIntegralOrder({
            orderNo: res.body.orderNo,
            userId: this.$store.state.userinfo.id,
          }).then((data) => {
            console.log(data)
            // setTimeout(() => {
            //   this.$router.back()
            // }, 800)
          })
        } else {
          this.$message.error(res.head.msg)
        }
      }).catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.zt-page__order {
  padding: 20px 0;
  box-sizing: border-box;
}
.zt-site__line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .zt-site__title {
    padding: 20px;
    color: #c9a76e;
    font-weight: 800;
    box-sizing: border-box;
  }
  .zt-site__add {
    padding: 20px;
    color: #0078d7;
    box-sizing: border-box;
  }
  .zt-site__add:hover {
    cursor: pointer;
  }
}
.zt-demo__drawer {
  padding: 0 20px;
}
.demo-drawer__content {
  padding: 0 40px;
  .demo-drawer__footer {
    justify-content: space-around;
  }
  .el-button--default {
    width: 40%;
  }
  .el-button--primary {
    width: 40%;
  }
}
::v-deep .el-page-header__content {
  font-size: 16px;
}
.zt-order__title {
  padding: 20px;
  color: #c9a76e;
  font-weight: 800;
  box-sizing: border-box;
}
.zt-site {
  margin: 10px 0;
  font-size: 16px;
  .zt-site__item {
    display: flex;
    align-items: center;
    padding: 10px 100px;
    box-sizing: border-box;
    .site-item__l {
      width: 100px;
      color: #ff0000;
      padding-left: 10px;
      box-sizing: border-box;
    }
    .zt-site__check {
      .site-radio {
        color: #16222b;
        font-size: 16px;
      }
      .defoSite {
        color: #fff;
        font-size: 16px;
        padding: 5px;
        background-color: #999;
      }
    }
    .el-radio__label {
      font-size: 16px !important;
    }
    .site-item__r {
      display: flex;
      position: absolute;
      right: 10px;
      color: #0078d7;
      .site-item__d {
        margin-right: 20px;
      }
    }
    .zt-siteInfo {
      display: flex;
      align-items: center;
      p {
        padding: 0 10px;
      }
    }
  }
  .site-item__select {
    position: relative;
    background-color: #fff0e8;
    padding: 10px 0;
    .site-radio {
      color: #000;
      font-size: 16px;
      font-weight: 800;
    }
  }
  .zt-site__item:hover {
    cursor: pointer;
  }
}
.zt-content {
  background-color: #f5f5f5;
  box-sizing: border-box;
}
.zt-content__item {
  padding: 20px;
  box-sizing: border-box;
  .zt-cart__title {
    display: flex;
    align-items: center;
    .zt-title__title {
      margin: 0 10px;
    }
  }
}
.zt-cart__size {
  width: 100%;
  margin: 10px 0;
}
// .el-collapse-item__header{
//   background-color: none !important;
//   height: auto !important;
// }
.zt-size__item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #ccc;
  box-sizing: border-box;
}
.zt-size__item:hover {
  cursor: pointer;
}
.zt-cart__line {
  padding: 10px 30px;
  padding-bottom: 0;
  width: 100%;
  background: #fff;
  margin: 10px 0;
  box-sizing: border-box;
  .el-row {
    display: flex;
    align-items: center;
  }
  .zt-cart__image {
    width: 100px;
    height: 100px;
    border-radius: 5px;
    border: 1px solid #c9a76e;
  }
  .zt-cart__name {
    p {
      color: #909193;
      font-size: 14px;
    }
  }
  .zt-cart__allPrice {
    color: #c9a76e;
  }
  .zt-cart__set {
    padding: 0 20px;
  }
  .zt-cart__set:hover {
    cursor: default;
  }
}
.zt-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #f6f5f3;
  .zt-footer__left {
    display: flex;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    .zt-left__btn {
      border: 1px solid #c9a76e;
      color: #c9a76e;
      text-align: center;
      padding: 5px 30px;
      margin: 0 20px;
      border-radius: 30px;
      box-sizing: border-box;
      .el-icon-delete {
        color: #c9a76e;
      }
    }
    .zt-left__btn:hover {
      cursor: pointer;
    }
  }
  .zt-red {
    font-size: 20px;
    font-weight: 800;
    color: #ff0000;
  }
  .zt-hui {
    color: #666;
  }
  .zt-footer__right {
    display: flex;
    text-align: right;
    font-size: 14px;
  }
}
.zt-footer__button {
  padding: 15px 50px;
  background-color: #cda46c;
  margin: 0 20px;
  border-radius: 30px;
  font-size: 18px;
  color: #fff;
  box-sizing: border-box;
}
.zt-footer__button:hover {
  cursor: pointer;
}
</style>
