<template>
  <div>
    <el-page-header @back="goBack" content="确认下单" />
    <div class="zt-site__line">
      <div class="zt-site__title">确认收货地址</div>
      <div class="zt-site__add" @click="addSite">新增收货地址</div>
    </div>
    <div class="zt-site" v-if="showEmp">
      <el-empty :image-size="100" description="暂无地址信息" />
    </div>
    <div class="zt-site" v-else>
      <div class="zt-site__item">
        <div class="zt-site__check">
          <el-checkbox v-model="checked" @change="cggoodsCheck(index)" />
        </div>
      </div>
    </div>
    <div class="zt-order__title">确认订单信息</div>
    <div class="zt-content">
      <div class="zt-content__item" v-for="(item, index) in formData.styleList" :key="index">
        <!-- 一级选择框 -->
        <div class="zt-cart__title">
          <!-- <el-checkbox v-model="item.goodsCheck" @change="cggoodsCheck(index)" /> -->
          <div class="zt-title__title">{{ item.styleName }}</div>
        </div>
        <div class="zt-cart__line" v-for="(itemN, indexN) in item.style" :key="indexN">
          <el-row :gutter="20">
            <!-- 二级选择框 -->
            <!-- <el-col :span="2">
              <el-checkbox v-model="itemN.checked" :span="2" @change="itemChecked(index, indexN)" />
            </el-col> -->
            <el-col :span="3">
            <!-- <div class="zt-cart__image"> -->
              <el-image
                style="width: 100px; height: 100px"
                :src="itemN.imgUrl"
                fit="contain"
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
            <!-- <el-col :span="5"><div class="zt-cart__color"></div></el-col> -->
            <!-- <el-col :span="4">
              <div class="zt-cart__color">总计：￥{{ itemN.stylePrice * itemN.styleNumber }}</div>
            </el-col> -->
            <el-col :span="3">
              <!-- <el-button type="primary">收起</el-button> -->
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
        <!-- <el-checkbox
          v-model="checkedAll"
          @change="toggleSelection"
        >已选</el-checkbox> -->
        <!-- <div class="zt-left__btn" @click="deleteAll"><i class="el-icon-delete"></i>批量删除</div> -->
      </div>
      <div class="zt-footer__right">
        <div class="zt-footer__price">
          应付总额: <span class="zt-red">￥{{ priceAll }}</span>
          <!-- <p class="zt-hui">本次共选：商品样式(2) 商品尺寸(7)</p> -->
        </div>
        <div class="zt-footer__button">
          提交订单
        </div>
      </div>
    </div>
    <el-drawer
      title="新增收货地址"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="ruleForm">
          <el-form-item label="收货人" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.phone" />
          </el-form-item>
          <el-form-item label="详细地址" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.siteInfo" />
          </el-form-item>
          <el-form-item label="设为默认收货地址" prop="delivery"  :label-width="formLabelWidth">
            <el-switch v-model="ruleForm.delivery" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getOrderSite, changeShoppingCart } from '@/api/orderCart'

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
      showDr: false,
      dialog: false,
      timer: null,
      loading: false,
      formLabelWidth: '150px',
      ruleForm: {
        name: '',
        phone: '',
        siteInfo: '',
        isdef: false, // s是否设为默认地址
      },
      rules: {
        name: [
          { required: true, message: '名字', trigger: 'blur' },
        ],
        phone: { required: true, message: '手机号', trigger: 'blur' },
        siteInfo: { required: true, message: '详细乡村/街道地址', trigger: 'blur' },
      },
    }
  },
  created() {
    this.getData()
    this.formData = this.$store.state.order.orderStorage
    // if (this.checkedAll) {
    //   this.priceAll = this.formData.styleTotalPrice
    // } else {
    //   this.priceAll = 0
    // }
    // console.log(this.formData)
  },
  methods: {
    async getData() {
      const that = this
      const res = await getOrderSite({
        customerId: sessionStorage.getItem('userId'),
      })
      that.siteList = res.body.resultList
      if (that.siteList && that.siteList.length === 0) {
        that.showEmp = true
      } else {
        that.showEmp = false
      }
      console.log(res)
    },
    goBack() {
      this.$router.go(-1)
    },
    chPrice() {
      const that = this
      if (that.checkedAll === true) {
        that.priceAll = that.formData.styleTotalPrice
      } else {
        that.formData.styleList.forEach(e => {
          e.style.forEach(i => {
            if (i.checked === true) {
              that.priceAll += i.styleNumber * i.stylePrice
            }
          })
        })
      }
    },
    addSite() {
      const that = this
      that.showDr = true
      that.dialog = true
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false
            }, 400)
          }, 2000)
        })
        .catch(_ => {})
    },
    cancelForm() {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
    },
  },
}
</script>

<style lang='scss' scoped>
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
    padding: 5px 40px;
    box-sizing: border-box;
  }
  .zt-site__item:hover{
    cursor: pointer;
  }
}
.zt-content{
  background-color: #f5f5f5;
  // border-radius: 20px;
  padding: 20px 10px;
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
  padding: 20px 0;
  border-top: 1px solid #ccc;
  box-sizing: border-box;
}
.zt-size__item:hover{
  cursor: pointer;
}
.zt-cart__line{
  padding: 10px 30px;
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
    // width: 300px;
    // padding: 0 10px;
    p{
      color: #909193;
      font-size: 14px;
    }
  }
  .zt-cart__color{
    // width: 150px;
    // padding: 0 20px;
  }
  .zt-cart__price{
    // width: 100px;
    // padding: 0 20px;
  }
  .zt-cart__num{
    // width: 100px;
    // padding: 0 20px;
  }
  .zt-cart__allPrice{
    // width: 100px;
    // padding: 0 20px;
    color: #c9a76e;
  }
  .zt-cart__set{
    // width: 100px;
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
  .zt-footer__right{
    display: flex;
    text-align: right;
    font-size: 14px;
    .zt-red{
      font-size: 20px;
      font-weight: 800;
      color: #FF0000;
    }
    .zt-hui{
      color: #666;
    }
    .zt-footer__button{
      padding: 15px 50px;
      background-color: #cda46c;
      margin-left: 20px;
      border-radius: 30px;
      font-size: 18px;
      color: #fff;
      box-sizing: border-box;
    }
  }
}
</style>
