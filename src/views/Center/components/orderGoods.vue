<template>
  <div class="zt-page__order">
    <el-page-header @back="goBack" content="确认下单" />
    <div class="zt-site__line">
      <div class="zt-site__title">确认收货地址</div>
      <div class="zt-site__add" @click="addSite">新增收货地址</div>
    </div>
    <div class="zt-site" v-if="showEmp">
      <el-empty :image-size="100" description="暂无地址信息" />
    </div>
    <div class="zt-site" v-else>
      <div
        class="zt-site__item"
        :class="radio === index?'site-item__select':''"
        v-for="(item, index) in siteList"
        :key="index"
      >
        <div class="site-item__l" v-if="radio === index">
          <i class="el-icon-location"></i>寄送至
        </div>
        <div class="zt-site__check">
          <el-radio v-model="radio" :label="index">
            <span class="site-radio">{{ item.address }} {{ ' ' }}({{ item.consignee }} 收){{ ' ' }}{{ item.contactNum }}</span>
          </el-radio>
          <span v-if="item.defaultNum === 1" class="defoSite">默认地址</span>
        </div>
        <div class="site-item__r" v-if="radio === index">
          <div class="site-item__d" @click="deleteSite">删除</div>
          <div class="site-item__c" @click="setSite">修改本地址</div>
        </div>
      </div>
    </div>
    <div class="zt-order__title">下单事由</div>
    <div class="zt-text">
      <!-- <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <el-form ref="textForm" :model="textForm" label-width="80px">
        <el-form-item label="类型">
          <el-select v-model="textForm.class" placeholder="请选择类型">
            <el-option
              v-for="item in 4"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="textForm.remarks" />
        </el-form-item>
      </el-form>
    </div>
    <div class="zt-order__title">确认订单信息</div>
    <div class="zt-content">
      <div class="zt-content__item" v-for="(item, index) in formData.styleList" :key="index">
        <!-- 一级选择框 -->
        <div class="zt-cart__title">
          <div class="zt-title__title">{{ item.styleName }}</div>
        </div>
        <div class="zt-cart__line" v-for="(itemN, indexN) in item.style" :key="indexN">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-image
                style="width: 100px; height: 100px"
                :src="itemN.imgUrl"
                fit="contain"
                @click="todetails(item.styleId)"
              />
            <!-- </div> -->
            </el-col>
            <el-col :span="10">
              <div class="zt-cart__name">
                {{ item.styleName }}
                <p>{{ item.styleNo }}</p>
              </div>
            </el-col>
            <el-col :span="6"><div class="zt-cart__color">颜色分类：{{ itemN.styleColor }}</div></el-col>
            <el-col :span="3">
              <el-button type="primary" @click="itemN.openList = !itemN.openList">
                {{ itemN.openList?'收起':'展开' }}
                <i v-if="itemN.openList" class="el-icon-caret-bottom el-icon--right"></i>
                <i v-else class="el-icon-caret-top el-icon--right"></i>
              </el-button>
            </el-col>
            <!-- <el-col :span="2"><div class="zt-cart__set" @click="deleteOrder(index,indexN)">删除</div></el-col> -->
          </el-row>
          <!-- <div class="zt-cart__size"> -->
          <div class="zt-cart__size" v-if="itemN.openList">
            <div class="zt-size__item" v-for="(itemM, indexM) in itemN.styleSize" :key="indexM">
              <div class="zt-size__size">所选尺码：{{ itemM.sizeName }}</div>
              <div class="zt-size__size">单价：￥{{ itemN.stylePrice }}</div>
              <div class="zt-size__size"><el-input-number disabled size="mini" :min="1" v-model="itemM.sizeNumber" /></div>
              <div class="zt-size__size">小计：￥{{ itemN.stylePrice * itemM.sizeNumber }}</div>
              <!-- <div class="zt-size__size" @click="deleteSize(index,indexN,indexM)">删除</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="zt-footer">
      <div class="zt-footer__left">
        <!-- <div class="zt-footer__price" v-if="siteList && siteList.length !== 0"> -->
        <div class="zt-footer__price">
          总金额: <span class="zt-red">￥{{ priceAll }}</span>
          <p>寄送地址：<span>{{ siteList[radio]?siteList[radio].address:'无' }}</span></p>
          <p>收货人：<span>{{ siteList[radio]?siteList[radio].consignee:'无' }}</span>{{ ' ' }}{{ siteList[radio]?siteList[radio].contactNum:'' }}</p>
          <!-- <p class="zt-hui">本次共选：商品样式(2) 商品尺寸(7)</p> -->
        </div>
      </div>
      <div class="zt-footer__right">
        <div class="zt-footer__button" @click="subOrder">
          提交订单
        </div>
      </div>
    </div>
    <el-drawer
      title="新增收货地址"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      size="40%"
      custom-class="zt-demo__drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          :label-position="labelPosition"
          :label-width="formLabelWidth"
          :hide-required-asterisk="false"
          ref="ruleForm"
        >
          <el-form-item label="收货人" prop="name">
            <el-input v-model="ruleForm.name" placeholder="名字" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input maxlength="11" v-model.number="ruleForm.phone" placeholder="手机号 " />
          </el-form-item>
          <el-form-item label="详细地址" prop="siteInfo">
            <el-input type="textarea" v-model="ruleForm.siteInfo" placeholder="详细乡村/街道地址" />
          </el-form-item>
          <el-form-item label="设为默认收货地址" prop="isdef">
            <el-switch v-model="ruleForm.isdef" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="subForm('ruleForm')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      title="修改收货地址"
      :before-close="handleClose2"
      :visible.sync="dialog2"
      direction="rtl"
      size="40%"
      custom-class="zt-demo__drawer"
      ref="drawer2"
    >
      <div class="demo-drawer__content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          :label-position="labelPosition"
          :label-width="formLabelWidth"
          :hide-required-asterisk="false"
          ref="ruleForm"
        >
          <el-form-item label="收货人" prop="name">
            <el-input v-model="ruleForm.name" placeholder="名字" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input maxlength="11" v-model.number="ruleForm.phone" placeholder="手机号 " />
          </el-form-item>
          <el-form-item label="详细地址" prop="siteInfo">
            <el-input type="textarea" v-model="ruleForm.siteInfo" placeholder="详细乡村/街道地址" />
          </el-form-item>
          <el-form-item label="设为默认收货地址" prop="isdef">
            <el-switch v-model="ruleForm.isdef" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm2">取 消</el-button>
          <el-button type="primary" @click="subForm2('ruleForm')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getOrderSite,
  addOrderSite,
  setOrderSite,
  CalculatePrice,
  addOrder,
  dltOrderSite,
} from '@/api/orderCart'

export default {
  name: 'ShopCart',
  data() {
    return {
      formData: {},
      formData2: {},
      checkedAll: false,
      priceAll: 0,
      checked: false,
      checkOrders: [],
      siteList: {},
      showEmp: false,
      radio: 0,
      styleList: [],
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
      textForm: {
        class: '',
        remarks: '',
      },
      ruleForm: {
        id: '',
        name: '',
        phone: '',
        siteInfo: '',
        isdef: false, // s是否设为默认地址
      },
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { min: 11, message: '请注意手机号格式', trigger: 'blur' },
          { pattern: /^[1][3,4,5,6,7,8][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
          // {
          //   min: 8, max: 12, message: '长度为 11 个字符', trigger: 'blur',
          // },
        ],
        siteInfo: { required: true, message: '地址不能为空', trigger: 'blur' },
      },
      oldUrl: '',
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.oldUrl = from.path
    })
  },
  created() {
    this.getData()
    this.formData = this.$store.state.order.orderStorage
  },
  beforeDestroy() {
    if (this.$route.path === '/styleCenter/goodsDetails') {
      this.$store.commit('order/cgStart', false)
    } else {
      this.$store.commit('order/cgStart', true)
    }
  },
  methods: {
    // 获取收货地址信息
    async getData() {
      const that = this
      const res = await getOrderSite({
        customerId: sessionStorage.getItem('userId'),
      })
      that.siteList = res.body.resultList
      if (that.siteList && that.siteList.length === 0) {
        that.showEmp = true
        this.$forceUpdate
      } else {
        that.showEmp = false
        this.$forceUpdate
      }
      that.priceA()
    },
    // 总价
    async priceA() {
      const that = this
      const list = []
      let dataL = {}
      that.formData.styleList.forEach(e => {
        e.style.forEach(i => {
          dataL = {
            styleId: i.styleId,
            styleNo: e.styleNo,
            styleColor: i.id,
            styleSize: [],
          }
          i.styleSize.forEach(n => {
            dataL.styleSize.unshift(n)
          })
          list.unshift(dataL)
        })
      })
      that.styleList = list
      const res = await CalculatePrice({
        styleList: list,
      })
      if (res.head.status === 0) {
        that.priceAll = res.body.styleTotalPrice
      }
    },
    goBack() {
      this.$router.back()
      // this.$store.commit('order/cgStart', false)
    },
    addSite() {
      const that = this
      that.ruleForm = {
        id: '',
        name: '',
        phone: '',
        siteInfo: '',
        isdef: 0, // s是否设为默认地址
      }
      that.showDr = true
      that.dialog = true
    },
    // 修改地址
    setSite() {
      const that = this
      that.ruleForm = {
        id: this.siteList[that.radio].id,
        name: this.siteList[that.radio].consignee,
        phone: this.siteList[that.radio].contactNum,
        siteInfo: this.siteList[that.radio].address,
        isdef: this.siteList[that.radio].defaultNum === 1, // s是否设为默认地址
      }
      that.showDr2 = true
      that.dialog2 = true
    },
    deleteSite() {
      this.$confirm('确认删除该地址吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await dltOrderSite({
          receivingId: this.siteList[this.radio].id,
        })
        if (res.head.status === 0) {
          this.$message.success('删除成功')
        } else {
          this.$message.warning('删除失败')
        }
        this.getData()
      }).catch(() => {})
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
    // 点击提交
    subForm(formName) {
      const that = this
      const isf = that.ruleForm.isdef ? 1 : 0
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await addOrderSite({
            consignee: that.ruleForm.name,
            contactNum: that.ruleForm.phone,
            address: that.ruleForm.siteInfo,
            customerId: sessionStorage.getItem('userId'),
            defaultNum: isf,
          })
          if (res.head.status === 0) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            that.getData()
            that.$forceUpdate
          } else {
            this.$message.error(res.head.msg)
          }
          that.loading = false
          that.dialog = false
          clearTimeout(that.timer)
        } else {
          that.$message.warning('请填写正确信息')
          that.loading = false
          // that.dialog = false
          return false
        }
      })
    },
    subForm2(formName) {
      const that = this
      const isf = that.ruleForm.isdef ? 1 : 0
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await setOrderSite({
            receivingId: that.ruleForm.id,
            consignee: that.ruleForm.name,
            contactNum: that.ruleForm.phone,
            address: that.ruleForm.siteInfo,
            customerId: sessionStorage.getItem('userId'),
            defaultNum: isf,
          })
          if (res.head.status === 0) {
            this.$message({
              message: '修改成功',
              type: 'success',
            })
            that.getData()
            that.$forceUpdate
          } else {
            this.$message.error(res.head.msg)
          }
          that.loading2 = false
          that.dialog2 = false
          clearTimeout(that.timer)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async subOrder() {
      const that = this
      if (that.siteList[that.radio] && that.siteList[that.radio].id) {
        const res = await addOrder({
          receivingId: that.siteList[that.radio].id,
          orderType: 1,
          styleList: that.styleList,
        })
        if (res.head.status === 0) {
          that.$message({
            type: 'success',
            message: '提交成功',
          })
          setTimeout(() => {
            that.$router.go(-1)
          }, 800)
        } else {
          that.$message({
            type: 'error',
            message: `提交失败,${res.head.msg}`,
          })
        }
      } else {
        this.$message.warning('请选择收货地址')
      }
    },
    // 推荐区  图片点击事件
    todetails(id) {
      this.$router.push(`/styleCenter/goodsDetails?id=${id}`)
    },
  },
}
</script>

<style lang='scss' scoped>
.zt-page__order{
  padding: 20px 0;
  box-sizing: border-box;
}
.zt-site__line{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .zt-site__title{
    padding: 20px;
    color: #c9a76e;
    font-weight: 800;
    box-sizing: border-box;
  }
  .zt-site__add{
    padding: 20px;
    color: #0078d7;
    box-sizing: border-box;
  }
  .zt-site__add:hover{
    cursor: pointer;
  }
}
.zt-demo__drawer{
  padding: 0 20px;
}
.demo-drawer__content{
  padding: 0 40px;
  .demo-drawer__footer{
    justify-content: space-around;
  }
  .el-button--default{
    width: 40%;
  }
  .el-button--primary{
    width: 40%;
  }
}
::v-deep .el-page-header__content{
  font-size: 16px;
}
.zt-order__title{
  padding: 20px;
  color: #c9a76e;
  font-weight: 800;
  box-sizing: border-box;
}
.zt-site{
  margin: 10px 0;
  font-size: 16px;
  .zt-site__item{
    display: flex;
    align-items: center;
    padding: 10px 100px;
    box-sizing: border-box;
    .site-item__l{
      width: 100px;
      color: #FF0000;
      padding-left: 10px;
      box-sizing: border-box;
    }
    .zt-site__check{
      .site-radio{
        color: #16222b;
        font-size: 16px;
      }
      .defoSite{
        color: #fff;
        font-size: 16px;
        padding: 5px;
        background-color: #999;
      }
    }
    .el-radio__label{
      font-size: 16px !important;
    }
    .site-item__r{
      display: flex;
      position: absolute;
      right: 10px;
      color: #0078d7;
      .site-item__d{
        margin-right: 20px;
      }
    }
    .zt-siteInfo{
      display: flex;
      align-items: center;
      p{
        padding: 0 10px;
      }
    }
  }
  .site-item__select{
    position: relative;
    background-color: #fff0e8;
    padding: 10px 0;
    .site-radio{
      color: #000;
      font-size: 16px;
      font-weight: 800;
    }
  }
  .zt-site__item:hover{
    cursor: pointer;
  }
}
.zt-content{
  background-color: #f5f5f5;
  // border-radius: 20px;
  padding: 10px 10px;
  box-sizing: border-box;
}
.zt-content__item{
  padding: 10px;
  box-sizing: border-box;
  .zt-cart__title{
    display: flex;
    align-items: center;
    .zt-title__title{
      margin: 0 10px;
    }
  }
}
.zt-cart__size{
  width: 100%;
  margin: 10px 0;
}
// .el-collapse-item__header{
//   background-color: none !important;
//   height: auto !important;
// }
.zt-size__item{
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #ccc;
  box-sizing: border-box;
}
.zt-size__item:hover{
  cursor: pointer;
}
.zt-cart__line{
  padding: 10px 30px;
  padding-bottom: 0;
  width: 100%;
  background: #fff;
  margin: 10px 0;
  box-sizing: border-box;
  .el-row{
    display: flex;
    align-items: center;
  }
  .zt-cart__image{
    width: 100px;
    height: 100px;
    border-radius: 5px;
    border: 1px solid #c9a76e;
  }
  .zt-cart__name{
    p{
      color: #909193;
      font-size: 14px;
    }
  }
  .zt-cart__allPrice{
    color: #c9a76e;
  }
  .zt-cart__set{
    padding: 0 20px;
  }
  .zt-cart__set:hover{
    cursor: default;
  }
}
.zt-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #f6f5f3;
  .zt-footer__left{
    display: flex;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    .zt-left__btn{
      border: 1px solid #c9a76e;
      color: #c9a76e;
      text-align: center;
      padding: 5px 30px;
      margin: 0 20px;
      border-radius: 30px;
      box-sizing: border-box;
      .el-icon-delete{
        color: #c9a76e;
      }
    }
    .zt-left__btn:hover{
      cursor: pointer;
    }
  }
  .zt-red{
    font-size: 20px;
    font-weight: 800;
    color: #FF0000;
  }
  .zt-hui{
    color: #666;
  }
  .zt-footer__right{
    display: flex;
    text-align: right;
    font-size: 14px;
    .zt-footer__button{
      padding: 15px 50px;
      background-color: #cda46c;
      margin: 0 20px;
      border-radius: 30px;
      font-size: 18px;
      color: #fff;
      box-sizing: border-box;
    }
    .zt-footer__button:hover{
      cursor: pointer;
    }
  }
}
</style>
