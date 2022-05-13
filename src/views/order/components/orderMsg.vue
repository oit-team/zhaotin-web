<template>
  <div>
    <HeaderNav class="mb-4" />
    <div class="main container">
      <div class="">
        <el-page-header
          @back="$router.back()"
          content="订单详情"
        />
        <div class="flex justify-between px-14">
          <div class=" font-extrabold">单号：{{ orderNo }}</div>
          <div class="font-extrabold">下单时间: {{ orderTime }}</div>
          <!-- <div class="font-extrabold text-xl">订单类型: {{ orderTypeName }}</div> -->
          <div class="font-extrabold">件数: {{ Numb }}件</div>
          <div class="font-extrabold">总金额: <span class="zt-red">￥{{ priceAll }}</span></div>
        </div>
        <!-- <el-table
          :data="orderInfoList"
          style="width: 100%"
          class="font-extrabold text-xl"
          cell-class-name="testclass"
          :cell-style="cellStyle"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="flex container flex-wrap ml-4">
                <div v-for="item in props.row.style" :key="item.id" label-position="left" inline class="flex items-center justify-center">
                  <div>
                    <div class="border border-solid border-gray-300 flex items-center"><img class="w-32 h-44" :src="item.imgUrl" alt="" /></div>
                  </div>
                  <div class="flex flex-col items-center">
                    <div>
                      <span>{{ item.styleColor }}</span>
                    </div>
                    <div class="" v-for="items in item.styleSize" :key="items.index">
                      <span>尺码*数量: {{ items.sizeName }} * {{ items.sizeNumber }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="styleName"
          />
          <el-table-column
            label="商品单价"
            prop="stylePrice"
          />
          <el-table-column
            label="商品总价"
            prop="styleTotal"
          />
          <el-table-column
            label="商品总数"
            prop="styleNumber"
          />
        </el-table> -->
        <div class="zt-content">
          <div class="zt-content__item" v-for="(item, index) in orderInfoList" :key="index">
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
              </el-row>
              <div class="zt-cart__size" v-if="itemN.openList">
                <div class="zt-size__item" v-for="(itemM, indexM) in itemN.styleSize" :key="indexM">
                  <div class="zt-size__size">所选尺码：{{ itemM.sizeName }}</div>
                  <div class="zt-size__size">单价：￥{{ itemN.stylePrice }}</div>
                  <div class="zt-size__size">x {{ itemM.sizeNumber }}</div>
                  <!-- <div class="zt-size__size"><el-input-number disabled size="mini" :min="1" v-model="itemM.sizeNumber" /></div> -->
                  <div class="zt-size__size">小计：￥{{ itemN.stylePrice * itemM.sizeNumber }}</div>
                  <!-- <div class="zt-size__size" @click="deleteSize(index,indexN,indexM)">删除</div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="zt-footer">
          <div class="zt-footer__left">
            <!-- <p>寄送地址：<span>{{ dataInfo.consigneeAddress || '无' }}</span></p>
            <p>收货人：<span>{{ dataInfo.consignee || '无' }}</span>{{ ' ' }}{{ dataInfo.consigneePhone || '' }}</p> -->
            <!-- <div class="zt-footer__price" v-if="siteList && siteList.length !== 0"> -->
          </div>
          <div class="zt-footer__right">
            <p>收货人：<span>{{ dataInfo.consignee || '无' }}</span>{{ ' ' }}{{ dataInfo.consigneePhone || '' }}</p>
            <p>寄送地址：<span>{{ dataInfo.consigneeAddress || '无' }}</span></p>
          </div>
        </div>
      </div>
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
import { getOrderById } from '@/api/order'

export default {
  components: {
    HeaderNav,
  },
  data() {
    return {
      orderId: '', // 订单编号
      orderNo: '',
      orderTime: '',
      orderTypeName: '',
      orderInfoList: [],
      Numb: 0,
      priceAll: 0,
      dataInfo: {},
    }
  },
  created() {
    if (this.$route.query.item) {
      this.orderId = this.$route.query.item.row.orderId
      this.orderInfo()
    }
  },
  methods: {
    // 获取订单详情数据
    async orderInfo() {
      const that = this
      const con = {
        orderId: that.orderId,
      }
      await getOrderById(con).then((res) => {
        if (res.head.status === 0) {
          that.dataInfo = res.body.resultList
          that.orderNo = res.body.resultList.orderNo
          that.orderTypeName = res.body.resultList.orderTypeName
          that.orderTime = res.body.resultList.orderTime
          that.orderInfoList = res.body.resultList.orderStyleList
          that.priceAll = res.body.resultList.totalOrderAmount

          that.orderInfoList.forEach(e => {
            that.Numb += e.styleNumber
            e.style.forEach(i => {
              that.$set(i, 'openList', true)
            })
          })
        }
      })
    },
    cellStyle({ columnIndex }) {
      if ([2, 3].includes(columnIndex)) {
        return {
          color: 'red',
        }
      }
    },
    // 推荐区  图片点击事件
    todetails(id) {
      this.$router.push(`/styleCenter/goodsDetails?id=${id}`)
    },
  },
}
</script>

<style lang="less" scoped>
  /deep/.el-table .el-table__cell  {
    padding: 25px 0;
  }
  /deep/.el-table th.el-table__cell > .cell {
    font-size: 16px;
  }
  /deep/.el-table .cell {
    font-size: 15px;
  }
  /deep/.el-form--inline .el-form-item {
    width: 138px;
  }
  /deep/.font-extrabold {
    width: 310px;
  }
  /deep/.font-extrabold {
    font-weight: 400;
  }
  /deep/.el-table td.el-table__cell div {
    margin-left: 10px;
    margin-bottom: 5px;
  }
  /deep/.el-form-item  {
    margin-bottom: 0;
  }
  /deep/ .font-extrabold {
    width: auto;
  }
  /deep/.el-page-header__left .el-icon-back {
    font-size: 16px;
  }
  /deep/.el-page-header__title {
    font-size: 16px;
    margin: 28px 0;
    line-height: 22px;
  }
  /deep/.el-page-header__content {
    display: flex;
    align-items: center;
    font-size: 16px;
    margin: 28px 0;
    line-height: 22px;
  }
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
.zt-red{
  color: #FF0000;
}
</style>
