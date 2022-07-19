<template>
  <div class="my-10">
    <!-- 头部 -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <el-page-header
          content="订单详情"
          @back="$router.back()"
        />
        <!-- <div>
          <el-button class="!text-amber-500" v-if="isUpdate && $route.query.item.row.orderState !== 2" type="text" @click="sett">{{ isSet?'完成':'修改' }}</el-button>
          <el-divider v-if="isUpdate && $route.query.item.row.orderState !== 2" direction="vertical" />
          <el-button class="!text-rose-500" v-if="isUpdate && $route.query.item.row.orderState !== 2" type="text" @click="deleteOrder">取消订单</el-button>
          <el-divider v-if="isUpdate && $route.query.item.row.orderState !== 2" direction="vertical" />
          <el-button type="text" @click="getNote">修改记录</el-button>
        </div> -->
      </div>
      <div class="flex justify-between px-14 zt-head">
        <div class="font-extrabold">
          单号：{{ goodsInfo.orderNo }}
        </div>
        <div class="font-extrabold">
          下单时间: {{ goodsInfo.orderTime }}
        </div>
        <!-- <div class="font-extrabold">订单类型: {{ orderTypeName }}</div> -->
        <!-- <div class="font-extrabold">件数: {{ goodsInfo.goodsNumber }}件</div>
        <div class="font-extrabold" v-show="!isSet">扣除积分: <span class="zt-red">{{ goodsInfo.goodsIntegral }}</span></div> -->
        <!-- <div class="font-extrabold flex" v-show="isSet">
          总金额:
          <el-input v-model="priceAll" class="ml-2" size="mini" placeholder="￥" />
        </div> -->
      </div>
      <!-- ----- -->
      <div class="zt-content">
        <div class="zt-content__item">
          <div class="zt-cart__title">
            <div class="zt-title__title">
              {{ goodsInfo.goodsName }}
            </div>
          </div>
          <div class="zt-cart__line">
            <el-row :gutter="20">
              <el-col :span="3">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="goodsInfo.goodsImg"
                  fit="contain"
                  @click="todetails(goodsInfo.goodsId)"
                />
              </el-col>
              <el-col :span="6">
                <div class="zt-cart__name">
                  {{ goodsInfo.goodsName }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="zt-cart__color">
                  物品编号{{ goodsInfo.goodsNo }}
                </div>
              </el-col>
              <el-col :span="6">
                <div class="zt-cart__color">
                  {{ goodsInfo.orderRemarks }}
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="zt-footer">
        <div class="">
          <!-- <p>下单原因：<span>{{ goodsInfo.orderReason || '无' }}</span></p> -->
          <!-- <p>订单备注：<span>{{ goodsInfo.orderNote || '无' }}</span></p> -->
          <div class="font-extrabold">
            数量: {{ goodsInfo.goodsNumber }}件
          </div>
          <div v-show="!isSet" class="font-extrabold">
            消费积分: <span class="zt-red">{{ goodsInfo.goodsIntegral }}</span>
          </div>
        </div>
        <div class="zt-footer__right">
          <p>收货人：<span>{{ goodsInfo.consignee || '无' }}</span>{{ ' ' }}{{ goodsInfo.consigneePhone || '' }}</p>
          <p>寄送地址：<span>{{ goodsInfo.consigneeAddress || '无' }}</span></p>
        </div>
      </div>
    </div>
    <div class="flex my-5">
      <div class="label w-24">
        订单备注：
      </div>
      <!-- <el-input type="textarea" :rows="4" v-model="orderNote" /> -->
      <div>{{ goodsInfo.orderRemarks }}</div>
    </div>
  </div>
</template>

<script>
import { getOrderDetail } from '@/api/order'

export default {
  name: 'OrderInfo',
  data() {
    return {
      goodsInfo: {},
      orderId: '',
      orderTime: '',
      orderTypeName: '',
      orderInfoList: [],
      Numb: 0,
      priceAll: 0,
      dataInfo: {},
      isSet: false,
      priceList: [],
      drawer: false,
      direction: 'rtl',
      drawerNote: false,
      textarea: '', // 修改订单原因
      bValidateForm: {
        cause: '',
      },
      loading: false,
      updateRecord: [], // 修改记录
      isUpdate: false,
    }
  },
  created() {
    // if (this.$route.query.stype && this.$route.query.stype === 'update' && this.$route.query.item.row.orderState !== '2') {
    //   this.isUpdate = true
    // }
    if (this.$route.query.item) {
      this.orderId = this.$route.query.item.row.id
      this.getData()
    }
  },
  methods: {
    getData() {
      getOrderDetail({
        id: this.orderId,
      }).then((res) => {
        this.goodsInfo = res.body.resultMap
      }).catch(() => {})
    },
  },
}
</script>

<style lang='scss' scoped>
.zt-content{
  background-color: #f5f5f5;
  // border-radius: 20px;
  padding: 20px 10px;
  margin-top: 15px;
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
  font-size: 16px;
  padding: 0 20px;
  background-color: #f6f5f3;
  .zt-footer__left{
    // display: flex;
    align-items: center;
    padding: 10px 0;
    line-height: 30px;
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
    // display: flex;
    align-items: center;
    padding: 10px 0;
    line-height: 30px;
    box-sizing: border-box;
    .zt-footer__button{
      padding: 15px 50px;
      background-color: #cda46c;
      margin-left: 20px;
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
.demo-drawer__content{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.zt-red{
  color: #FF0000;
}
</style>
